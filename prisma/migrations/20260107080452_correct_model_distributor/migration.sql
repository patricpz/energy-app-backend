/*
  Warnings:

  - You are about to drop the column `city` on the `EnergyDistributor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EnergyDistributor" DROP COLUMN "city";

-- CreateTable
CREATE TABLE "EnergyDistributorArea" (
    "id" SERIAL NOT NULL,
    "state" CHAR(2) NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "distributorId" INTEGER NOT NULL,

    CONSTRAINT "EnergyDistributorArea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EnergyDistributorArea_state_city_idx" ON "EnergyDistributorArea"("state", "city");

-- CreateIndex
CREATE INDEX "EnergyDistributorArea_state_city_district_idx" ON "EnergyDistributorArea"("state", "city", "district");

-- AddForeignKey
ALTER TABLE "EnergyDistributorArea" ADD CONSTRAINT "EnergyDistributorArea_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "EnergyDistributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
