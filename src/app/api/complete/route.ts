import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/utils/backend/getUserId";
import { cancelEvent, cancelCron } from "@/inggest/events";

export async function GET(req: NextRequest) {
    const userId = await getUserId();
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
        return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    try {
        await prisma.$transaction(async (tx) => {
            const task = await tx.task.findUnique({
                where: {
                    id: taskId,
                    userId,
                },
            });

            if (!task) {
                throw new Error("TASK_NOT_FOUND");
            }

            await tx.task.update({
                where: { id: taskId },
                data: { status: "COMPLETED" },
            });

            await cancelEvent(taskId);
            await cancelCron(taskId);

        });

        return NextResponse.json(
            { message: "Task completed successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error completing task:", error);
        return NextResponse.json({ success : false , error : "Failed to move to complete" }, { status: 500 });
    }
}
