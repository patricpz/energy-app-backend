import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

export const energyHourRepository = {
    findAllByUser: (userId: number) => {
        return prisma.energyHour.findMany({
            where: {
                day: {
                    month: {
                        year: {
                            userId: userId
                        }
                    }
                }
            }
        });
    },

    createOrUpdateHour: async (dayId: number, hour: number, expenseKwh: number) => {
        let energyHour = await prisma.energyHour.findUnique({
            where: { dayId_hour: { dayId, hour } }
        })

        if (!energyHour) {
            energyHour = await prisma.energyHour.create({
                data: { dayId, hour, pulse: 1, expenseKwh }
            });
        } else {
            energyHour = await prisma.energyHour.update({
                where: { id: energyHour.id },
                data: {
                    expenseKwh: { increment: expenseKwh },
                    pulse: (energyHour.pulse ?? 0) + 1 
                }
            });
        }
    }
}