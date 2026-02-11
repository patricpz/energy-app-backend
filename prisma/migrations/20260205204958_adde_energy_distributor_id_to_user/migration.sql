-- AlterTable
ALTER TABLE "User" ADD COLUMN     "energyDistributorId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_energyDistributorId_fkey" FOREIGN KEY ("energyDistributorId") REFERENCES "EnergyDistributor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
