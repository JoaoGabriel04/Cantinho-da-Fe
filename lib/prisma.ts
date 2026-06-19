import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function criarPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não está definida nas variáveis de ambiente.");
  }
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter } as any);
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? criarPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
