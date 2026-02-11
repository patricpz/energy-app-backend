import { PrismaClient, Prisma } from "../generated/prisma/client";

const prisma = new PrismaClient();

export const energyDistributorRepository = {
    findAll: () => prisma.energyDistributor.findMany(),
}