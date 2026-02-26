/*
  Warnings:

  - You are about to drop the column `tsee` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "tsee",
ADD COLUMN     "ruralZone" BOOLEAN NOT NULL DEFAULT false;
