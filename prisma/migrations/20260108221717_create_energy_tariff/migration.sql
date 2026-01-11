-- CreateTable
CREATE TABLE "EnergyTariff" (
    "id" SERIAL NOT NULL,
    "tusd" DECIMAL(10,6),
    "te" DECIMAL(10,6),
    "reh" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "modality" TEXT NOT NULL,
    "subClass" TEXT,
    "tariffPost" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "distributorId" INTEGER NOT NULL,

    CONSTRAINT "EnergyTariff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EnergyTariff_distributorId_startDate_endDate_idx" ON "EnergyTariff"("distributorId", "startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "EnergyTariff_distributorId_startDate_modality_subClass_tari_key" ON "EnergyTariff"("distributorId", "startDate", "modality", "subClass", "tariffPost");

-- AddForeignKey
ALTER TABLE "EnergyTariff" ADD CONSTRAINT "EnergyTariff_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "EnergyDistributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
