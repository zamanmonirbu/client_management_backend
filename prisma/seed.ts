import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing users to avoid duplicates
  await prisma.user.deleteMany();

  // Create a test admin user
  await prisma.user.create({
    data: {
      email: 'testuser@example.com',
      name: 'Test Admin',
      password: '$2b$10$...hashed_password...', // Use bcrypt.hash('password123', 10) to generate
      role: 'ADMIN',
      refreshToken: null,
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());