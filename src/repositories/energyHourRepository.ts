import { PrismaClient, Prisma } from "../generated/prisma/client";

const prisma = new PrismaClient();

export const energyHourRepository = {
    findAllByUser: async (userId: number, year: number, month: number, day: number) => {
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

        const energyDay = await prisma.energyDay.findUnique({
            where: { monthId_day: { monthId: energyMonth.id, day } },
            select: { id: true }
        });

        if (!energyDay) throw new Error("Day not found");

        return prisma.energyHour.findMany({
            where: { dayId: energyDay.id },
            orderBy: { hour: "asc" }
        })
    },

    createOrUpdateHour: async (dayId: number, hour: number, expenseKwh: number, account: number) => {
        return prisma.energyHour.upsert({
            where: {
                dayId_hour: { dayId, hour }
            },
            create: {
                dayId, 
                hour,
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