import { PrismaClient } from "../generated/prisma/client";

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