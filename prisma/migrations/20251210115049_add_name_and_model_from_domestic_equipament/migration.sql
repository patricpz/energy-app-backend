/*
  Warnings:

  - Added the required column `name` to the `DomesticEquipament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DomesticEquipament" ADD COLUMN     "model" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;
