/*
  Warnings:

  - You are about to alter the column `account` on the `EnergyDay` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `account` on the `EnergyHour` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `account` on the `EnergyMonth` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "EnergyDay" ALTER COLUMN "account" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "EnergyHour" ALTER COLUMN "account" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "EnergyMonth" ALTER COLUMN "account" SET DATA TYPE DECIMAL(10,2);
