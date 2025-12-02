import prisma from "@/lib/prisma";

export async function changeTaskStatus(taskId: string) {

    if (!taskId) {
        throw new Error("No task id in change status")
    }
    try {
        //change the task status from incoming to due 
        const task = await prisma.task.findFirst({
            where: {
                id: taskId
            }
        });

        if (!task) {
            throw new Error("No task found");
        }

        await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                status: "OVERDUE"
            }
        });

        return { success: true };
    } catch (error) {
        console.log("Something went wrong in the changeTaskStatus function", error);
        throw new Error("Something went wrong in the change task status");
    }
}