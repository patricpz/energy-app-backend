-- CreateTable
CREATE TABLE "EnergyDistributor" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" CHAR(2) NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "EnergyDistributor_pkey" PRIMARY KEY ("id")
);
