import { PrismaClient, Prisma } from "../generated/prisma/client";

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

    createOrUpdateMonth: async (yearId: number, month: number, expenseKwh: number, account: number) => {
        return prisma.energyMonth.upsert({
            where: {
                yearId_month: { yearId, month }
            },
            create: {
                yearId, 
                month,
                pulse: 1,
                expenseKwh,
                account: new Prisma.Decimal(account)
            },
            update: {
                pulse: { increment: 1 },
                expenseKwh: { increment: expenseKwh },
                account: { increment: new Prisma.Decimal(account) }
            }
        });
    },
}
