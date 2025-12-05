/*
  Warnings:

  - You are about to drop the column `totalKwh` on the `EnergyHour` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EnergyHour" DROP COLUMN "totalKwh",
ADD COLUMN     "account" DOUBLE PRECISION,
ADD COLUMN     "expenseKwh" DOUBLE PRECISION;
