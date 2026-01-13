import { energyHourRepository } from "../repositories/energyHourRepository";
import { energyDayRepository } from "../repositories/energyDayRepository";
import { energyMonthRepository } from "../repositories/energyMonthRepository";
import { energyYearRepository } from "../repositories/energyYearRepository";
import { PrismaClient } from "../generated/prisma/client";
import { calculateValuePulseService } from "./calculateValuePulseService";

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
            where: { id: userId },
            include: { address: true }
        })
        if (!user) {
            throw new Error("user not found");
        }

        const constant = user.constantMedidor ?? 3200;
        const expenseKwh = 1 / constant;
        const possibleKwh = this.transformKwh(userId, constant);

        const tariff = await prisma.energyTariff.findFirst({
            where: {
                distributor: { state: user.address?.state },
                startDate: { lte: now },
                OR: [{ endDate: null }, { endDate: { gte: now } }],
            },
            orderBy: { startDate: "desc" }
        });
        const icms = await prisma.icmsRate.findFirst({
            where: {
                state: user.address?.state,
                consumerType: user.ruralZone ? "RURAL" : "RESIDENCIAL",
                minKwh: { lte: expenseKwh },
                OR: [{ maxKwh: null }, { maxKwh: { gte: expenseKwh } }],
            }
        });
        const flag = await prisma.tariffFlag.findFirst({
            where: { year, month }
        });
        const cip = user.cipValue ? Number(user.cipValue) / 30 / 24 / constant : 0;
        const pulseValue = calculateValuePulseService.calculatePulseValue({
            kwh: expenseKwh,
            te: Number(tariff?.te ?? 0),
            tusd: Number(tariff?.tusd ?? 0),
            flag: flag?.additionalKwh ?? 0,
            icms: icms?.rate ?? 0,
            cip
        })

        const energyYear = await energyYearRepository.createOrUpdateYear(userId, year, expenseKwh, pulseValue);
        const energyMonth = await energyMonthRepository.createOrUpdateMonth(energyYear.id, month, expenseKwh, pulseValue);
        const energyDay = await energyDayRepository.createOrUpdateDay(energyMonth.id, day, expenseKwh, pulseValue);
        const updatedHour = await energyHourRepository.createOrUpdateHour(energyDay.id, hour, expenseKwh, pulseValue);

        return updatedHour;
    },

    listEnergyHours: async (userId: number, year: number, month: number, day: number) => {
        const data = await energyHourRepository.findAllByUser(userId, year, month, day);
        
        const total = data.reduce((acc, item) => acc + (Number(item.expenseKwh) || 0), 0);
        const average = data.length > 0 ? total / data.length : 0;
    
        return { total, average, data };
    },

    listEnergyDays: async (userId: number, year: number, month: number) => {
    const data = await energyDayRepository.findAllByUser(userId, year, month);

    const total = data.reduce((acc, item) => acc + (Number(item.expenseKwh) || 0), 0);
    const average = data.length > 0 ? total / data.length : 0;

    return { total, average, data };
    },

    listEnergyMonths: async (userId: number, year: number) => {
    const data = await energyMonthRepository.findAllByUser(userId, year);

    const total = data.reduce((acc, item) => acc + (Number(item.expenseKwh) || 0), 0);
    const average = data.length > 0 ? total / data.length : 0;

    return { total, average, data };
    },

    listEnergyYears: async (userId: number) => {
    const data = await energyYearRepository.findAllByUser(userId);

    const total = data.reduce((acc, item) => acc + (Number(item.expenseKwh) || 0), 0);
    const average = data.length > 0 ? total / data.length : 0;

    return { total, average, data };
    },

    relatoryToday: async (userId: number) => {
        const today = await energyDayRepository.findToday(userId);
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
};