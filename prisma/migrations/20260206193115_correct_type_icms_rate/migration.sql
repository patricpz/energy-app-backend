/*
  Warnings:

  - You are about to alter the column `minKwh` on the `IcmsRate` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `maxKwh` on the `IcmsRate` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `rate` on the `IcmsRate` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,4)`.

*/
-- AlterTable
ALTER TABLE "IcmsRate" ALTER COLUMN "minKwh" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "maxKwh" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "rate" SET DATA TYPE DECIMAL(5,4);
