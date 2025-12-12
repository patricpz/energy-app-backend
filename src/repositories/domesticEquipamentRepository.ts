import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

export const domesticEquipamentRepository = {
    create: (userId: number, name: string, consumeKwh: number, model?: string) => {
        return prisma.domesticEquipament.create({
            data: { userId, name, consumeKwh, model }
        })
    },

    findAllByUser: (userId: number) => {
        return prisma.domesticEquipament.findMany({ where: { userId: userId } });
    },

    findById: (id: number) => {
        return prisma.domesticEquipament.findUnique({ where: { id } });
    }
}