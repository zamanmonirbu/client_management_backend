// tests/setup.integration.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

jest.setTimeout(30000);

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

beforeAll(async () => {
  try {
    await prisma.$connect();
    // await prisma.client.deleteMany();
    await prisma.user.deleteMany({ where: { email: { in: ['testuser@example.com'] } } });

    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        name: 'Test User',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Integration test database initialized with test user');
  } catch (error) {
    console.error('Setup error:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await prisma.$disconnect();
    console.log('Integration test database disconnected');
  } catch (error) {
    console.error('Disconnect error:', error);
  }
});

(global as any).prisma = prisma;