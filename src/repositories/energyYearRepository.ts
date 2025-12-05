import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

export const energyYearRepository = {
    findAllByUser: (userId: number) => {
        return prisma.energyYear.findMany({
            where: {
                userId: userId
            }
        });
    },
    
    createOrUpdateYear: async (userId: number, year: number, expenseKwh: number) => {
        let energyYear = await prisma.energyYear.findUnique({
            where: { userId_year: { userId, year } }
        });

        if (!energyYear) {
            energyYear = await prisma.energyYear.create({
                data: { userId, year, pulse: 1, expenseKwh }
            });
        } else {
            await prisma.energyYear.update({
                where: { userId_year: { userId, year } },
                data: { 
                    expenseKwh: { increment: expenseKwh },
                    pulse: (energyYear.pulse ?? 0) + 1,
                }
            })
        }

        return energyYear;
    }
}