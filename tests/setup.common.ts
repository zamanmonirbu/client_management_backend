// tests/setup.common.ts
import { PrismaClient } from '@prisma/client';

if (expect.getState().currentTestName?.includes('integration')) {
  const prisma = new PrismaClient();
  
  beforeAll(async () => {
    await prisma.client.deleteMany();
    await prisma.user.deleteMany();
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });
  
  (global as any).prisma = prisma;
}