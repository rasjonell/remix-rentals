import { PrismaClient } from '@prisma/client';

let DB: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  DB = new PrismaClient();
} else if (!global.__db) {
  global.__db = new PrismaClient();
} else {
  DB = global.__db;
}

export { DB };
