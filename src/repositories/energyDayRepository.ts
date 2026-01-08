import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

export const energyDayRepository = {
    findAllByUser: async (userId: number, year: number, month: number) => {
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

    createOrUpdateDay: async (monthId: number, day: number, expenseKwh: number) => {
        let energyDay = await prisma.energyDay.findUnique({
            where: { monthId_day: { monthId, day } }
        })

        if (!energyDay) {
            energyDay = await prisma.energyDay.create({
                data: { monthId, day, pulse: 1, expenseKwh }
            })
        } else {
            await prisma.energyDay.update({
                where: { monthId_day: { monthId, day } },
                data: {
                    expenseKwh: { increment: expenseKwh },
                    pulse: (energyDay.pulse ?? 0) + 1,
                }
            })
        }

        return energyDay;
    }
}