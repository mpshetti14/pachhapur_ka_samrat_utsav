import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 12) {
    throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters before seeding');
  }
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL.toLowerCase() },
    update: { role: Role.ADMIN },
    create: { name: 'Festival Administrator', email: process.env.ADMIN_EMAIL.toLowerCase(), passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12), role: Role.ADMIN },
  });
  if (await prisma.event.count() === 0) {
    await prisma.event.createMany({ data: [
      { name: 'Shri Ganesh Sthapana', date: new Date('2026-09-14'), time: '9:00 AM', location: 'Pachhapur Samrat Mandap', description: 'Traditional pran pratishtha, aarti, and community welcome.' },
      { name: 'Maha Aarti & Bhajan Sandhya', date: new Date('2026-09-18'), time: '7:30 PM', location: 'Main Festival Stage', description: 'An evening of devotional music and collective maha aarti.' },
      { name: 'Visarjan Procession', date: new Date('2026-09-24'), time: '4:00 PM', location: 'Pachhapur Naduvin Pete Bazar Road', description: 'Community procession and farewell celebrations.' },
    ] });
  }
  console.log('Database seeded');
}

main().finally(() => prisma.$disconnect());