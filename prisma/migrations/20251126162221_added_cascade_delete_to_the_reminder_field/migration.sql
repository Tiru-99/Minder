-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_taskId_fkey";

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
