import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

export const energyMonthRepository = {
    findAllByUser: async (userId: number, year: number) => {
        const energyYear = await prisma.energyYear.findUnique({
            where: { userId_year: { userId, year } },
            select: { id: true }
        });

        if (!energyYear) throw new Error("Year not found");

        return prisma.energyMonth.findMany({
            where: { yearId: energyYear.id },
            orderBy: { month: "asc" }
        });
    },

    createOrUpdateMonth: async (yearId: number, month: number, expenseKwh: number) => {
        let energyMonth = await prisma.energyMonth.findUnique({
            where: { yearId_month: { yearId, month } }
        });

        if (!energyMonth) {
            energyMonth = await prisma.energyMonth.create({
                data: { yearId, month, pulse: 1, expenseKwh }
            });
        } else {
            await prisma.energyMonth.update({
                where: { yearId_month: { yearId, month } },
                data: {
                    expenseKwh: { increment: expenseKwh },
                    pulse: (energyMonth.pulse ?? 0) + 1,
                }
            })
        }

        return energyMonth;
    },
}
