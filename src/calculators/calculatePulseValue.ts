import { Prisma, PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

export function calculatePulseValue(params: {
    monthKwh: Prisma.Decimal,
    kwh: Prisma.Decimal,
    te: Prisma.Decimal,
    tusd: Prisma.Decimal,
    flag: Prisma.Decimal,
    icms: Prisma.Decimal,
    tsee: boolean
}) {
    const tariffValue = params.te.add(params.tusd).add(params.flag);

    let billableKwh = params.kwh;
    if (params.tsee) {
        const limit = new Prisma.Decimal(80);
        const remainingFree = limit.sub(params.monthKwh);
        if (remainingFree.gt(0)) {
            billableKwh = Prisma.Decimal.max(new Prisma.Decimal(0), params.kwh.sub(remainingFree));
        }
    }

    const energyBase = billableKwh.mul(tariffValue);
    if (energyBase.equals(0)) return new Prisma.Decimal(0);

    const icmsBase = energyBase.div(new Prisma.Decimal(1).sub(params.icms));
    const pisConfins = energyBase.mul(new Prisma.Decimal("0.0365"));
    
    return icmsBase.add(pisConfins);
}