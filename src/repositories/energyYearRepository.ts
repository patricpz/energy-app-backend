import { PrismaClient, Prisma } from "../generated/prisma/client";

type PrismaOrTx = PrismaClient | Prisma.TransactionClient;

export const energyYearRepository = {
    findAllByUser: (prisma: PrismaOrTx, userId: number) => {
        return prisma.energyYear.findMany({
            where: {
                userId: userId
            }
        });
    },
    
    createOrUpdateYear: async (prisma: PrismaOrTx, userId: number, year: number, expenseKwh: Prisma.Decimal, account: Prisma.Decimal) => {
        return prisma.energyYear.upsert({
            where: {
                userId_year: { userId, year }
            },
            create: {
                userId, 
                year,
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