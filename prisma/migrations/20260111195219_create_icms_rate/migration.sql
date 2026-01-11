-- CreateTable
CREATE TABLE "IcmsRate" (
    "id" SERIAL NOT NULL,
    "state" CHAR(2) NOT NULL,
    "consumerType" TEXT NOT NULL,
    "minKwh" DOUBLE PRECISION NOT NULL,
    "maxKwh" DOUBLE PRECISION,
    "rate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IcmsRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IcmsRate_state_consumerType_idx" ON "IcmsRate"("state", "consumerType");
