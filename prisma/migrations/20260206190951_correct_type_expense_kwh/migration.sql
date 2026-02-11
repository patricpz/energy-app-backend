/*
  Warnings:

  - You are about to alter the column `expenseKwh` on the `EnergyDay` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `expenseKwh` on the `EnergyHour` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `expenseKwh` on the `EnergyMonth` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `expenseKwh` on the `EnergyYear` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - Made the column `energyDistributorId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_energyDistributorId_fkey";

-- AlterTable
ALTER TABLE "EnergyDay" ALTER COLUMN "expenseKwh" SET DATA TYPE DECIMAL(10,4);

-- AlterTable
ALTER TABLE "EnergyHour" ALTER COLUMN "expenseKwh" SET DATA TYPE DECIMAL(10,4);

-- AlterTable
ALTER TABLE "EnergyMonth" ALTER COLUMN "expenseKwh" SET DATA TYPE DECIMAL(10,4);

-- AlterTable
ALTER TABLE "EnergyYear" ALTER COLUMN "expenseKwh" SET DATA TYPE DECIMAL(10,4);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "energyDistributorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_energyDistributorId_fkey" FOREIGN KEY ("energyDistributorId") REFERENCES "EnergyDistributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
