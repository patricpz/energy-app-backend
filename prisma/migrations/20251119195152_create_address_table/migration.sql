-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "state" CHAR(2) NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" VARCHAR(9) NOT NULL,
    "district" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);
