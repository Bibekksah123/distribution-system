import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set before creating the Prisma client");
}

const adapter = new PrismaPg(databaseUrl);

export const prisma = new PrismaClient({ adapter });
