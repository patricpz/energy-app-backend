/*
  Warnings:

  - You are about to alter the column `account` on the `EnergyYear` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "EnergyYear" ALTER COLUMN "account" SET DATA TYPE DECIMAL(10,2);
