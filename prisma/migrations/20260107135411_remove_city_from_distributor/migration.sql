/*
  Warnings:

  - You are about to drop the `EnergyDistributorArea` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EnergyDistributorArea" DROP CONSTRAINT "EnergyDistributorArea_distributorId_fkey";

-- DropTable
DROP TABLE "EnergyDistributorArea";
