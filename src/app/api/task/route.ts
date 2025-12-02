// route to insert and get the task and update the task 
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/utils/backend/getUserId";
import { scheduleEvent, cancelEvent, updateEvent, cancelCron } from "@/inggest/events";

export async function POST(request: NextRequest) {
  const userId = await getUserId();
  const { name, notes, deadline, type, reminders: incomingReminders, after_due_reminder } =
    await request.json();

  if (!name || !deadline || !type || !incomingReminders) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {

    //transaction
    const { task, reminders } = await prisma.$transaction(async (tx) => {
      const createdTask = await tx.task.create({
        data: {
          userId,
          name,
          notes,
          deadline: new Date(deadline),
          type,
          status: "PENDING_INCOMING"
        },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      });

      const createdReminders = await tx.reminder.create({
        data: {
          taskId: createdTask.id,
          ...incomingReminders,
          after_due_reminder,
        },
        select: {
          before48h: true,
          before24h: true,
          before12h: true,
          before6h: true,
          before3h: true,
          before1h: true,
          before0h: true,
          after_due_reminder: true,
        },
      });

      return { task: createdTask, reminders: createdReminders };
    });

    if (!task?.user?.email || !task?.user?.name) {
      throw new Error("Task user data missing!");
    }

    const reminderKeyArr = Object.keys(reminders);
    const schedulePayload = {
      taskId: task.id,
      name: task.name,
      reminders: reminderKeyArr,
      username: task.user.name,
      userEmail: task.user.email,
      taskDueDate: task.deadline,
      after_due_reminder: reminders.after_due_reminder,
    };

    try {
      await scheduleEvent(schedulePayload);
      //update to incoming only after event is scheduled
      await prisma.task.update({
        where: {
          id: task.id
        },
        data: {
          status: "INCOMING"
        }
      })
    } catch (scheduleError) {
      //todo : handle the pending incoming tasks by using inngest queues 
      throw new Error(
        `Failed to schedule event: ${scheduleError instanceof Error ? scheduleError.message : String(scheduleError)}`
      );
    }

    return NextResponse.json(
      {
        success: true,
        task,
        message: "Task created successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while creating task:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while creating the task. Please try again.",
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
        },
        status: {
          not: "PENDING_INCOMING"
        }
      },
      include: {
        reminder: {
          select: {
            before48h: true,
            before24h: true,
            before12h: true,
            before6h: true,
            before3h: true,
            before1h: true,
            after_due_reminder: true
          }
        }
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
    const body = await req.json();
    const { id, status, deadline, reminder: incomingReminders } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Handle Status Update
    if (status) {
      const updatedTask = await prisma.task.update({
        where: { id, userId },
        data: { status },
      });
      return NextResponse.json({
        success: true,
        message: "Task status updated",
        task: updatedTask,
      });
    }

    // Handle Deadline/Reminder Update
    const { after_due_reminder } = incomingReminders || {};

    if (!deadline || !incomingReminders) {
      return NextResponse.json(
        { success: false, error: "Incomplete fields for deadline update" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const task = await tx.task.update({
        where: { id: id, userId },
        data: {
          deadline: new Date(deadline),
          reminder: {
            update: {
              ...incomingReminders,
              after_due_reminder
            }
          },
        },
        include: {
          user: { select: { name: true, email: true } },
          reminder: {
            select: {
              before48h: true,
              before12h: true,
              before6h: true,
              before3h: true,
              before1h: true,
              after_due_reminder: true,
            },
          },
        },
      });

      if (!task || !task.reminder || !task.user?.name || !task.user?.email) {
        throw new Error("Task user information missing");
      }

      const payload = {
        taskId: task.id,
        name: task.name,
        reminders: Object.entries(task.reminder)
          .filter(([_, v]) => v === true)
          .map(([k]) => k),
        username: task.user.name,
        userEmail: task.user.email,
        taskDueDate: task.deadline,
        after_due_reminder: task.reminder.after_due_reminder,
      };

      await updateEvent(payload);

      return task;
    });

    return NextResponse.json({
      success: true,
      message: "Task deadline updated",
      task: result,
    });

  } catch (err: any) {
    // Prisma "Record not found"
    if (err.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Task not found or unauthorized." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: err.message ?? "Something went wrong updating the task",
      },
      { status: 500 }
    );
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
    const result = await prisma.$transaction(async (tx) => {
      const task = await tx.task.findFirst({
        where: {
          id: taskId,
          userId
        }
      });

      if (!task) {
        return { notFound: true };
      }

      await tx.task.delete({
        where: { id: taskId }
      });

      await cancelEvent(task.id);
      await cancelCron(task.id);

      return { notFound: false };
    });

    if (result.notFound) {
      return NextResponse.json(
        {
          success: false,
          error: "Task not found"
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully deleted the task"
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Task Deletion error :", error);
    return NextResponse.json({
      success: false,
      error: "Something went wrong while deleting task"
    });
  }
}
