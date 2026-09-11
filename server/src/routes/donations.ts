import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, type AuthRequest } from '../middleware/auth.js';

export const donationRouter = Router();
donationRouter.use(authenticate);

const donationInput = z.object({
  donorName: z.string().trim().min(2).max(80),
  mobile: z.string().trim().min(10).max(15),
  amount: z.coerce.number().positive().max(10000000),
  purpose: z.string().trim().min(2).max(120),
  paymentMethod: z.string().trim().min(2).max(40),
});

donationRouter.get('/mine', async (request: AuthRequest, response, next) => {
  try {
    response.json(await prisma.donation.findMany({ where: { userId: request.user!.id }, orderBy: { createdAt: 'desc' } }));
  } catch (error) { next(error); }
});

donationRouter.post('/', async (request: AuthRequest, response, next) => {
  try {
    const donation = await prisma.donation.create({ data: { ...donationInput.parse(request.body), userId: request.user!.id } });
    response.status(201).json(donation);
  } catch (error) { next(error); }
});