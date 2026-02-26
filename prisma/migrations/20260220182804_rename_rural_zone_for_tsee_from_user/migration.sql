/*
  Warnings:

  - You are about to drop the column `ruralZone` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "ruralZone",
ADD COLUMN     "tsee" BOOLEAN NOT NULL DEFAULT false;
