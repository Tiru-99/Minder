// route to insert and get the task and update the task 
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/utils/getUserId";
import { scheduleEvent, cancelEvent, updateEvent } from "@/inggest/events";

export async function POST(request: NextRequest) {
  const userId = await getUserId();
  const { name, notes, deadline, type, reminders : incomingReminders } = await request.json();

  if (!name || !deadline || !type || !incomingReminders) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const task = await prisma.task.create({
      data: {
        userId,
        name,
        notes,
        deadline: new Date(deadline),
        type
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });


    const reminders = await prisma.reminder.create({
      data: {
        taskId: task.id,
        ...(incomingReminders)
      } , 
      select : {
        before48h : true , 
        before24h : true , 
        before12h : true , 
        before6h : true , 
        before3h : true , 
        before1h : true ,
        before0h : true , 
        after_due_reminder : true
      }
    });

    if(!reminders){
      throw new Error("No reminders found whlie scheduling event"); 
    }

    const reminderKeyArr = Object.keys(reminders).map(key => {
      return key
    })

    if (!task || !task.user.email || !task.user.name) {
      throw new Error("Task user data not found!");
    }

    const data = {
      taskId: task.id,
      name: task.name,
      reminders: reminderKeyArr,
      username: task.user.name,
      userEmail: task.user.email,
      //check for date types
      taskDueDate: task.deadline,
      after_due_reminder : reminders.after_due_reminder
    }

    await scheduleEvent(data);

    return NextResponse.json({
      success : true , 
      task , 
      message : "Task created successfully"
    } , { status : 200 });

  } catch (error) {
    console.error("Error while inserting task:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating the task. Please try again.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {

    const userId = await getUserId();

    const tasks = await prisma.task.findMany({
      where: {
        user: {
          id: userId
        }
      },
      include: {
        reminder: true
      }
    });

    return NextResponse.json({
      tasks,
      success: true
    }, { status: 200 })

  } catch (error) {
    console.log("Get tasks err", error);
    return NextResponse.json({
      success: false,
      error: "Something went wrong while fetching tasks"
    }, { status: 500 });
  }

}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getUserId();
    const { deadline, taskId } = await req.json();

    if (!deadline || !taskId) {
      return NextResponse.json({
        success: false,
        error: "Incomplete fields sent to the backend"
      });
    }

    const task = await prisma.task.update({
      where: {
        id: taskId,
        userId: userId
      },
      data: {
        deadline: new Date(deadline)
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        reminder: {
          select: {
            before48h: true,
            before12h: true,
            before6h: true,
            before3h: true,
            before1h: true,
            after_due_reminder : true 
          }
        }
      }
    });

    if (!task || !task.reminder || !task.user?.name || !task.user?.email) {
      throw new Error("No task details found");
    }

    const reminders = task.reminder;

    const reminderKeyArr = Object.keys(reminders).map(key => {
      return key
    })

    const data = {
      taskId: task.id,
      name: task.name,
      reminders: reminderKeyArr,
      username: task.user.name,
      userEmail: task.user.email,
      //check for date types
      taskDueDate: task.deadline,
      after_due_reminder : task.reminder.after_due_reminder
    }

    await updateEvent(data);

    return NextResponse.json({
      success: true,
      message: "Task deadline updated"
    });

  } catch (error) {
    console.log("Update task issue", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong while snoozing"
    });
  }
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserId();
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");

  if (!taskId) {
    throw new Error("taskId not received in the backend");
  }

  try {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId
      }
    });

    if (!task) {
      return NextResponse.json({
        success: false,
        error: "Task not found"
      }, {
        status: 400
      })
    }

    await prisma.task.delete({
      where: {
        id: taskId,
        userId
      }
    });

    cancelEvent(task.id);

    return NextResponse.json({
      success : true ,
      message : "Successfully deleted the task"
    } , { status : 200 });
  } catch (error) {
    console.log("Task Deletion error : ", error);
    return NextResponse.json({
      success: false,
      error: "Something went wrong while deleting task"
    });
  }
}
