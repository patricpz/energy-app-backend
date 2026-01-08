    import { energyHourRepository } from "../repositories/energyHourRepository";
    import { energyDayRepository } from "../repositories/energyDayRepository";
    import { energyMonthRepository } from "../repositories/energyMonthRepository";
    import { energyYearRepository } from "../repositories/energyYearRepository";
    import { PrismaClient } from "../generated/prisma/client";

    const prisma = new PrismaClient();

    export const energyService = {

        lastPulseTimestamp: {} as Record<number, number>,

        transformKwh(userId: number, medidorConstant: number = 3200): number {
            const newTimestamp = Date.now();

            if (!this.lastPulseTimestamp[userId]) {
                this.lastPulseTimestamp[userId] = newTimestamp;
                return 0;
            }

            const deltaSec = (newTimestamp - this.lastPulseTimestamp[userId]);
            const watts = 3600000 / (deltaSec * medidorConstant);

            this.lastPulseTimestamp[userId] = newTimestamp;

            return watts;
        },  

        async registerPulse(userId: number, timestamp?: string) {
            const now = timestamp ? new Date(timestamp) : new Date();

            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            const hour = now.getHours();

            let user = await prisma.user.findUnique({
                where: { id: userId }
            })
            if (!user) {
                throw new Error("user not found");
            }

            const constant = user.constantMedidor ?? 3200;
            const expenseKwh = 1 / constant;
            const possibleKwh = this.transformKwh(userId, constant);

            const energyYear = await energyYearRepository.createOrUpdateYear(userId, year, expenseKwh);
            const energyMonth = await energyMonthRepository.createOrUpdateMonth(energyYear.id, month, expenseKwh);
            const energyDay = await energyDayRepository.createOrUpdateDay(energyMonth.id, day, expenseKwh);

            const updatedHour = await energyHourRepository.createOrUpdateHour(energyDay.id, hour, expenseKwh);

            return updatedHour;
        },

        listEnergyHours: (userId: number, year: number, month: number, day: number) => energyHourRepository.findAllByUser(userId, year, month, day),

        listEnergyDays: (userId: number, year: number, month: number) => energyDayRepository.findAllByUser(userId, year, month),

        listEnergyMonths: (userId: number, year: number) => energyMonthRepository.findAllByUser(userId, year),
        
        listEnergyYears: (userId: number) => energyYearRepository.findAllByUser(userId),
    }