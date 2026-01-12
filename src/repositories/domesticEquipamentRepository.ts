import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

export const domesticEquipamentRepository = {
    create: (userId: number, name: string, consumeKwh: number, power: number, model?: string) => {
        return prisma.domesticEquipament.create({
            data: { userId, name, consumeKwh, power, model, isTurnedOn: false }
        })
    },

    findAllByUser: (userId: number) => {
        return prisma.domesticEquipament.findMany({ where: { userId: userId } });
    },

    findById: (id: number, userId: number) => {
        return prisma.domesticEquipament.findFirst({ where: { id, userId } });
    }, 

    update: (id: number, userId: number, data: any) => {
        return prisma.domesticEquipament.update({
            where: { id, userId },
            data: {
                name: data.name,
                consumeKwh: data.consumeKwh,
                power: data.power,
                model: data.model
            }
        })
    },

    delete: (id: number, userId: number) => {
        return prisma.domesticEquipament.delete({ where: { id, userId } });
    }
}