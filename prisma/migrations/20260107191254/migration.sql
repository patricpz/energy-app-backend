/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `EnergyDistributor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cnpj` to the `EnergyDistributor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EnergyDistributor" ADD COLUMN     "cnpj" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EnergyDistributor_cnpj_key" ON "EnergyDistributor"("cnpj");
