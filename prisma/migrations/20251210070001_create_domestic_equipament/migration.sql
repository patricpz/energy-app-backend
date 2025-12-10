-- CreateTable
CREATE TABLE "DomesticEquipament" (
    "id" SERIAL NOT NULL,
    "consumeKwh" DOUBLE PRECISION NOT NULL,
    "active" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "DomesticEquipament_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DomesticEquipament" ADD CONSTRAINT "DomesticEquipament_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
