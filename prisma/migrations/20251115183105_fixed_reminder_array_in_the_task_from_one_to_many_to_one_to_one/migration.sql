/*
  Warnings:

  - A unique constraint covering the columns `[taskId]` on the table `Reminder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reminder_taskId_key" ON "Reminder"("taskId");
