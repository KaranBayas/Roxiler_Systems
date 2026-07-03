import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✓ Admin created:', admin.email);

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log('✓ User created:', testUser.email);

  // Create stores
  const store1 = await prisma.store.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Pizza Palace',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      description: 'Authentic Italian pizza restaurant',
    },
  });
  console.log('✓ Store created:', store1.name);

  const store2 = await prisma.store.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Coffee Corner',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      description: 'Premium coffee and pastries',
    },
  });
  console.log('✓ Store created:', store2.name);

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
