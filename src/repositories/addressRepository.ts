import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

export const addressRepository = {
      create: async (data: {
        state: string;
        city: string;
        zipCode: string;
        district: string;
        street: string;
        number: string;
        complement?: string;
        userId: number;
      }) => {
        return prisma.address.create({
            data,
        })
      },
    
      findById: (id: number) => prisma.address.findUnique({ where: { id } }),
    
      findAll: () => prisma.address.findMany(),
}