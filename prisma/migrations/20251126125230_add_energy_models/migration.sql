/*
  Warnings:

  - Made the column `userId` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable
CREATE TABLE "EnergyYear" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "expenseKwh" DOUBLE PRECISION,
    "account" DOUBLE PRECISION,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "EnergyYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnergyMonth" (
    "id" SERIAL NOT NULL,
    "month" INTEGER NOT NULL,
    "expenseKwh" DOUBLE PRECISION,
    "account" DOUBLE PRECISION,
    "pulse" INTEGER,
    "yearId" INTEGER NOT NULL,

    CONSTRAINT "EnergyMonth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnergyDay" (
    "id" SERIAL NOT NULL,
    "day" INTEGER NOT NULL,
    "totalKwh" DOUBLE PRECISION,
    "account" DOUBLE PRECISION,
    "pulse" INTEGER,
    "monthId" INTEGER NOT NULL,

    CONSTRAINT "EnergyDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnergyHour" (
    "id" SERIAL NOT NULL,
    "hour" INTEGER NOT NULL,
    "totalKwh" DOUBLE PRECISION,
    "pulse" INTEGER,
    "dayId" INTEGER NOT NULL,

    CONSTRAINT "EnergyHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EnergyYear_userId_year_key" ON "EnergyYear"("userId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "EnergyMonth_yearId_month_key" ON "EnergyMonth"("yearId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "EnergyDay_monthId_day_key" ON "EnergyDay"("monthId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "EnergyHour_dayId_hour_key" ON "EnergyHour"("dayId", "hour");

-- AddForeignKey
ALTER TABLE "EnergyYear" ADD CONSTRAINT "EnergyYear_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyMonth" ADD CONSTRAINT "EnergyMonth_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "EnergyYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyDay" ADD CONSTRAINT "EnergyDay_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "EnergyMonth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyHour" ADD CONSTRAINT "EnergyHour_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "EnergyDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
