import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};
declare global {
  // pour éviter les doublons en dev avec Next.js
  var prisma: PrismaClient | undefined
}
const db =
  globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}


// export prisma as db
export default db;
