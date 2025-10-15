import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    client: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

beforeAll(async () => {
  await prisma.user.deleteMany();
});

afterEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await prisma.$disconnect();
});