import { energyHourRepository } from "../repositories/energyHourRepository";
import { energyDayRepository } from "../repositories/energyDayRepository";
import { energyMonthRepository } from "../repositories/energyMonthRepository";
import { energyYearRepository } from "../repositories/energyYearRepository";
import { energyDistributorRepository } from "../repositories/energyDistributorRepository";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { calculateService } from "./calculateService";

const prisma = new PrismaClient();

export const energyService = {

    //lastPulseTimestamp: {} as Record<number, number>,

    async registerPulse(userId: number, timestamp?: string) {
        const now = timestamp ? new Date(timestamp) : new Date();

        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const hour = now.getHours();

        let user = await prisma.user.findUnique({
            where: { id: userId },
            include: { address: true }
        })
        if (!user) {
            throw new Error("user not found");
        }

        const constant = user.constantMedidor ?? 3200;
        const expenseKwh = new Prisma.Decimal(1).div(constant);
        //const possibleKwh = calculateService.calculateImediateWtt(userId, constant, this.lastPulseTimestamp);

        let monthKwh = new Prisma.Decimal(0);
        const currentYear = await prisma.energyYear.findFirst({where: {userId, year}});
        if (currentYear) {
            const currentMonth = await prisma.energyMonth.findFirst({where: {yearId: currentYear.id, month}});
            monthKwh = currentMonth?.expenseKwh ?? new Prisma.Decimal(0);
        }
        const pulseValue = await calculateService.CalculatePulse(user, userId, monthKwh, expenseKwh, constant, now, year, month);

        return prisma.$transaction(async (tx) => {
            const energyYear = await energyYearRepository.createOrUpdateYear(tx, userId, year, new Prisma.Decimal(expenseKwh), new Prisma.Decimal(pulseValue));
            const energyMonth = await energyMonthRepository.createOrUpdateMonth(tx, energyYear.id, month, new Prisma.Decimal(expenseKwh), new Prisma.Decimal(pulseValue));
            const energyDay = await energyDayRepository.createOrUpdateDay(tx, energyMonth.id, day, new Prisma.Decimal(expenseKwh), new Prisma.Decimal(pulseValue));
            const updatedHour = await energyHourRepository.createOrUpdateHour(tx, energyDay.id, hour, new Prisma.Decimal(expenseKwh), new Prisma.Decimal(pulseValue));

            return updatedHour;
        });
    },

    listEnergyHours: async (userId: number, year: number, month: number, day: number) => {
        const data = await energyHourRepository.findAllByUser(prisma, userId, year, month, day);
        
        const total = data.reduce((acc, item) => acc + (Number(item.expenseKwh) || 0), 0);
        const average = data.length > 0 ? total / data.length : 0;
    
        return { total, average, data };
    },

    listEnergyDays: async (userId: number, year: number, month: number) => {
        const data = await energyDayRepository.findAllByUser(prisma, userId, year, month);

        const total = data.reduce((acc, item) => acc + (Number(item.expenseKwh) || 0), 0);
        const average = data.length > 0 ? total / data.length : 0;

        return { total, average, data };
    },

    listEnergyMonths: async (userId: number, year: number) => {
        const data = await energyMonthRepository.findAllByUser(prisma, userId, year);

        const total = data.reduce((acc, item) => acc + (Number(item.expenseKwh) || 0), 0);
        const average = data.length > 0 ? total / data.length : 0;

        return { total, average, data };
    },

    listEnergyYears: async (userId: number) => {
        const data = await energyYearRepository.findAllByUser(prisma, userId);

        const total = data.reduce((acc, item) => acc + (Number(item.expenseKwh) || 0), 0);
        const average = data.length > 0 ? total / data.length : 0;

        return { total, average, data };
    },

    relatoryToday: async (userId: number) => {
        const today = await energyDayRepository.findToday(prisma, userId);
        if (!today || !today.hours || today.hours.length === 0) {
            return { totalKwh: today?.expenseKwh ?? 0, maxKwh: null, minKwh: null };
        }

        let maxKwh = today.hours[0];
        let minKwh = today.hours[0];

        for (const hour of today.hours) {
            if ( hour.expenseKwh !== null && ( maxKwh.expenseKwh === null || hour.expenseKwh > maxKwh.expenseKwh ) ) {
                maxKwh = hour;
            }
            if ( hour.expenseKwh !== null && ( minKwh.expenseKwh === null || hour.expenseKwh < minKwh.expenseKwh ) ) {
                minKwh = hour;
            }
        }

        return {
            totalKwh: today.expenseKwh ?? 0,
            maxKwh: maxKwh.expenseKwh,
            minKwh: minKwh.expenseKwh
        }
    },

    listEnergyDistributor: async () => await energyDistributorRepository.findAll(),
};