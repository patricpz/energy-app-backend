import { PrismaClient, Prisma } from "../generated/prisma/client";

type PrismaOrTx = PrismaClient | Prisma.TransactionClient;

export const energyDayRepository = {
    findAllByUser: async (prisma: PrismaOrTx, userId: number, year: number, month: number) => {
        const energyYear = await prisma.energyYear.findUnique({
            where: { userId_year: { userId, year } },
            select: { id: true }
        });

        if (!energyYear) throw new Error("Year not found");
        
        const energyMonth = await prisma.energyMonth.findUnique({
            where: { yearId_month: { yearId: energyYear.id, month } },
            select: { id: true }
        });

        if (!energyMonth) throw new Error("Month not found");

        return prisma.energyDay.findMany({
            where: { monthId: energyMonth.id },
            orderBy: { day: "asc" }
        });
    },

    findToday: async (prisma: PrismaOrTx, userId: number) => {
        return await prisma.energyDay.findFirst({
            where: { month: { year: { userId } } },
            orderBy: [
                { month: { year: { year: "desc" } } },
                { month: { month: "desc" } },
                { day: "desc" }
            ],
            select: {
                id: true,
                day: true,
                expenseKwh: true,
                hours: {
                    orderBy: { hour: "asc" },
                    select: {
                        id: true,
                        hour: true,
                        expenseKwh: true,
                    }
                }
            }
        })
    },

    createOrUpdateDay: async (prisma: PrismaOrTx, monthId: number, day: number, expenseKwh: Prisma.Decimal, account: Prisma.Decimal) => {
        return prisma.energyDay.upsert({
            where: {
                monthId_day: { monthId, day }
            },
            create: {
                monthId, 
                day,
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
    }
}