import { Prisma, PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

export function calculatePulseValue(params: {
    kwh: Prisma.Decimal,
    te: Prisma.Decimal,
    tusd: Prisma.Decimal,
    flag: Prisma.Decimal,
    icms: Prisma.Decimal,
    cip: Prisma.Decimal,
}) {
    const subtotal = params.kwh.mul(
        params.te.add(params.tusd).add(params.flag)
    );
    const icmsValue = subtotal.div(
        new Prisma.Decimal(1).sub(params.icms)
    );
    const pisConfins = icmsValue.mul(new Prisma.Decimal(0.0485));
    
    return icmsValue.add(pisConfins).add(params.cip);
}