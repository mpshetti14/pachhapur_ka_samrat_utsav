import { Router } from 'express';
import { DonationStatus } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

export const publicRouter = Router();

publicRouter.get('/events', async (_request, response, next) => {
  try { response.json(await prisma.event.findMany({ orderBy: { date: 'asc' } })); } catch (error) { next(error); }
});
publicRouter.get('/announcements', async (_request, response, next) => {
  try { response.json(await prisma.announcement.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } })); } catch (error) { next(error); }
});
publicRouter.get('/gallery', async (_request, response, next) => {
  try { response.json(await prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } })); } catch (error) { next(error); }
});
publicRouter.get('/donations/total', async (_request, response, next) => {
  try {
    const total = await prisma.donation.aggregate({ where: { status: DonationStatus.VERIFIED }, _sum: { amount: true } });
    response.json({ totalVerified: total._sum.amount ?? 0 });
  } catch (error) { next(error); }
});