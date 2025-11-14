-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('PERSONAL', 'WORK', 'HEALTH');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('INCOMING', 'COMPLETED', 'OVERDUE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "deadline" TIMESTAMP(3) NOT NULL,
    "type" "TaskType" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "before48h" BOOLEAN NOT NULL DEFAULT false,
    "before24h" BOOLEAN NOT NULL DEFAULT true,
    "before12h" BOOLEAN NOT NULL DEFAULT true,
    "before6h" BOOLEAN NOT NULL DEFAULT false,
    "before3h" BOOLEAN NOT NULL DEFAULT false,
    "before1h" BOOLEAN NOT NULL DEFAULT true,
    "taskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
