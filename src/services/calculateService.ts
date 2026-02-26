import { Prisma, PrismaClient } from "../generated/prisma/client";
import { calculatePulseValue } from "../calculators/calculatePulseValue";

const prisma = new PrismaClient();

type UserWithAddress = Prisma.UserGetPayload<{ include: { address: true } }>;

export const calculateService = {
    calculateImediateWtt(userId: number, medidorConstant: number = 3200, lastPulseTimestamp: Record<number, number>): number {
        const newTimestamp = Date.now();

        if (!lastPulseTimestamp[userId]) {
            lastPulseTimestamp[userId] = newTimestamp;
            return 0;
        }

        const deltaSec = (newTimestamp - lastPulseTimestamp[userId]);
        const watts = 3600000 / (deltaSec * medidorConstant);

        lastPulseTimestamp[userId] = newTimestamp;

        return watts;
    },  

    CalculatePulse: async (
        user: UserWithAddress,
        userId: number, 
        monthKwh: Prisma.Decimal,
        expenseKwh: Prisma.Decimal,
        constant: number,
        now: Date,
        year: number,
        month: number
    ) => {
        const currentYear = await prisma.energyYear.findUnique({where: {userId_year: { userId, year }}});
        let projectedMonthExpenseKwh = expenseKwh;
        if (currentYear) {
            const currentMonth = await prisma.energyMonth.findUnique({where: {yearId_month: { yearId: currentYear.id, month }}});
            if (currentMonth?.expenseKwh) projectedMonthExpenseKwh = currentMonth.expenseKwh.plus(expenseKwh);
        }

        if (!user.energyDistributorId) throw new Error("User not energy distributor");

        const tariff = await prisma.energyTariff.findFirst({
            where: {
                distributorId: user.energyDistributorId!,
                startDate: { lte: now },
                OR: [{ endDate: null }, { endDate: { gte: now } }],
            },
            orderBy: { startDate: "desc" }
        });
        const icms = await prisma.icmsRate.findFirst({
            where: {
                state: user.address?.state,
                consumerType: user.ruralZone ? "RURAL" : "RESIDENCIAL",
                minKwh: { lte: projectedMonthExpenseKwh },
                OR: [{ maxKwh: null }, { maxKwh: { gte: projectedMonthExpenseKwh } }],
            },
            orderBy: {
                minKwh: "desc",
            },
        });
        const flag = await prisma.tariffFlag.findFirst({
            where: { year, month }
        });
        const cip = user.cipValue ? user.cipValue.div(30).div(24).div(constant) : new Prisma.Decimal(0);

        const pulseValue = calculatePulseValue({
            monthKwh,
            kwh: expenseKwh,
            te: tariff?.te ?? new Prisma.Decimal(0),
            tusd: tariff?.tusd ?? new Prisma.Decimal(0),
            flag: new Prisma.Decimal(flag?.additionalKwh ?? 0),
            icms: icms?.rate ?? new Prisma.Decimal(0),
            tsee: user.tsee
        });

        return pulseValue;
    }, 
}