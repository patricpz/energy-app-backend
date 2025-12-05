/*
  Warnings:

  - You are about to drop the column `totalKwh` on the `EnergyDay` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EnergyDay" DROP COLUMN "totalKwh",
ADD COLUMN     "expenseKwh" DOUBLE PRECISION;
