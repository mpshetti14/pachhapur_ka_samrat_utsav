import { Router } from 'express';
import { DonationStatus, Role } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize } from '../middleware/auth.js';

export const adminRouter = Router();
adminRouter.use(authenticate, authorize(Role.COMMITTEE, Role.ADMIN));

adminRouter.get('/users', authorize(Role.ADMIN), async (_request, response, next) => {
  try { response.json(await prisma.user.findMany({ select: { id: true, name: true, email: true, mobile: true, role: true, createdAt: true } })); } catch (error) { next(error); }
});
adminRouter.patch('/users/:id/role', authorize(Role.ADMIN), async (request, response, next) => {
  try {
    const role = z.nativeEnum(Role).parse(request.body.role);
    response.json(await prisma.user.update({ where: { id: String(request.params.id) }, data: { role }, select: { id: true, role: true } }));
  } catch (error) { next(error); }
});

adminRouter.get('/donations', async (request, response, next) => {
  try {
    const status = request.query.status ? z.nativeEnum(DonationStatus).parse(request.query.status) : undefined;
    const search = String(request.query.search ?? '').trim();
    const where = { status, OR: search ? [{ donorName: { contains: search, mode: 'insensitive' as const } }, { mobile: { contains: search, mode: 'insensitive' as const } }] : undefined };
    const [donations, total] = await Promise.all([
      prisma.donation.findMany({ where, orderBy: { createdAt: 'desc' } }),
      prisma.donation.aggregate({ where: { status: DonationStatus.VERIFIED }, _sum: { amount: true } }),
    ]);
    response.json({ donations, totalVerified: total._sum.amount ?? 0 });
  } catch (error) { next(error); }
});
adminRouter.patch('/donations/:id/status', async (request, response, next) => {
  try {
    const status = z.nativeEnum(DonationStatus).parse(request.body.status);
    response.json(await prisma.donation.update({ where: { id: String(request.params.id) }, data: { status } }));
  } catch (error) { next(error); }
});

const eventInput = z.object({ name: z.string().min(2), date: z.coerce.date(), time: z.string().min(1), location: z.string().min(2), description: z.string().min(2) });
const announcementInput = z.object({ title: z.string().min(2), content: z.string().min(2), important: z.boolean().default(false), published: z.boolean().default(true) });
const imageInput = z.object({ title: z.string().min(2), imageUrl: z.string().url(), altText: z.string().min(2) });

for (const [path, model, schema] of [
  ['events', prisma.event, eventInput], ['announcements', prisma.announcement, announcementInput], ['gallery', prisma.galleryImage, imageInput],
] as const) {
  adminRouter.post(`/${path}`, async (request, response, next) => {
    try { response.status(201).json(await (model.create as Function)({ data: schema.parse(request.body) })); } catch (error) { next(error); }
  });
  adminRouter.delete(`/${path}/:id`, async (request, response, next) => {
    try { await (model.delete as Function)({ where: { id: String(request.params.id) } }); response.status(204).end(); } catch (error) { next(error); }
  });
}