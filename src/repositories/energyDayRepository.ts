import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

export const energyDayRepository = {
    findAllByUser: (userId: number, yearId: number, monthId: number) => {
        return prisma.energyDay.findMany({
            where: {
                monthId: monthId,
                month: {
                    yearId: yearId,
                    year: {
                        userId: userId
                    }
                }
            }
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