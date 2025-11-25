import { PrismaClient, User } from '../generated/prisma/client';

const prisma = new PrismaClient();

export const userRepository = {
  create: (data: Omit<User, 'id' | 'createdAt'>) => prisma.user.create({ data }),

  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),

  findAll: () => prisma.user.findMany(),

  findById: (id: number) => {
    return prisma.user.findUnique({
      where: { id },
      include: {
        address: true
      }
    });
  },

  update: (id: number, data: any) => {
    const {address, ...userData} = data;

    return prisma.user.update({
      where: { id },
      data: {
        ...userData,
        address: address
        ? {
            upsert: {
              create: address,
              update: address,
            }
          }
        : undefined
      },
      include: {
        address: true,
      }
    });
  },

  delete: (id: number) => {
    return prisma.user.delete({
      where: { id },
    })
  },
};
