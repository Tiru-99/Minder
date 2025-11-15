import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/utils/getUserId";
import prisma from "@/lib/prisma";
import { cancelCron, cancelEvent } from "@/inggest/events";

export async function PATCH(req: NextRequest) {
    const userId = await getUserId();
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
        throw new Error("Task Id not received on backend");
    }

    try {
        //find 
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
            }, { status: 400 });
        }

        await prisma.task.update({
            where: {
                id: taskId,
                userId
            },
            data: {
                status: "COMPLETED"
            }
        });

        //remove all the events
        await cancelCron(task.id);
        await cancelEvent(task.id);

        return NextResponse.json({
            success: true,
            message: "Successfully updated the task"
        }, { status: 200 })
    } catch (error) {
        console.error("task updating to complete failed" , error); 
        return NextResponse.json({
            success : false , 
            message : "Something went wrong while updating status"
        } , { status : 500 });
    }
}