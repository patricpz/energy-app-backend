import { PrismaClient, Prisma } from "../generated/prisma/client";

type PrismaOrTx = PrismaClient | Prisma.TransactionClient;

export const energyMonthRepository = {
    findAllByUser: async (prisma: PrismaOrTx, userId: number, year: number) => {
        const energyYear = await prisma.energyYear.findUnique({
            where: { userId_year: { userId, year } },
            select: { id: true }
        });

        if (!energyYear) throw new Error("Year not found");

        return prisma.energyMonth.findMany({
            where: { yearId: energyYear.id },
            orderBy: { month: "asc" },
            include: {
                days: {
                    orderBy: { day: "asc" }
                }
            }
        });
    },

    createOrUpdateMonth: async (prisma: PrismaOrTx, yearId: number, month: number, expenseKwh: Prisma.Decimal, account: Prisma.Decimal) => {
        return prisma.energyMonth.upsert({
            where: {
                yearId_month: { yearId, month }
            },
            create: {
                yearId, 
                month,
                pulse: 1,
                expenseKwh,
                account
            },
            update: {
                pulse: { increment: 1 },
                expenseKwh: { increment: expenseKwh },
                account: { increment: account }
            }
        });
    },
}
