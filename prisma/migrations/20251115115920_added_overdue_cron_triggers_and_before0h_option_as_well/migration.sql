-- CreateEnum
CREATE TYPE "AfterDueCron" AS ENUM ('after_every_12h', 'after_every_24h', 'after_every_48h', 'after_every_6h');

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "after_due_reminder" "AfterDueCron" NOT NULL DEFAULT 'after_every_24h',
ADD COLUMN     "before0h" BOOLEAN NOT NULL DEFAULT true;
