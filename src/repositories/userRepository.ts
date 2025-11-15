import { PrismaClient, User } from '../generated/prisma/client';

const prisma = new PrismaClient();

export const userRepository = {
  create: (data: Omit<User, 'id' | 'createdAt'>) => prisma.user.create({ data }),

  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),

  findAll: () => prisma.user.findMany(),
};
