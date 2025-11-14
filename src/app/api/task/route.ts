// route to insert and get the task and update the task 
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/getUserId";

export async function POST(request: NextRequest) {
    const userId = await getUserId();
    const { name, notes, deadline, type, reminders } = await request.json();

    if (!name || !deadline || !type) {
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
            }
        });

        //if reminders is not empty then spread it other wise 
        // return empty object 

        const hasReminders = Object.keys(reminders).length > 0;

        const reminder = await prisma.reminder.create({
            data: {
                taskId: task.id,
                ...(hasReminders && reminders)
            }
        });

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

export async function GET(req: NextRequest) {
    try {

        const userId = await getUserId();

        const tasks = await prisma.task.findMany({
            where: {
                user: {
                    id: userId
                }
            },
            include: {
                reminders: true
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

    await prisma.task.update({
      where: {
        id: taskId,
        userId: userId
      },
      data: {
        deadline: new Date(deadline)
      }
    });

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
