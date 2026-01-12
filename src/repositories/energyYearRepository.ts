import { PrismaClient, Prisma } from "../generated/prisma/client";

const prisma = new PrismaClient();

export const energyYearRepository = {
    findAllByUser: (userId: number) => {
        return prisma.energyYear.findMany({
            where: {
                userId: userId
            }
        });
    },
    
    createOrUpdateYear: async (userId: number, year: number, expenseKwh: number, account: number) => {
        return prisma.energyYear.upsert({
            where: {
                userId_year: { userId, year }
            },
            create: {
                userId, 
                year,
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
    }
}