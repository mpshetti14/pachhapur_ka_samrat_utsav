import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, type AuthRequest } from '../middleware/auth.js';

export const authRouter = Router();
const credentials = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(72),
});
const registration = credentials.extend({
  name: z.string().trim().min(2).max(80),
  mobile: z.string().trim().min(10).max(15).optional(),
});

function session(user: { id: string; name: string; email: string; mobile: string | null; role: string }) {
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  return { token, user };
}

authRouter.post('/register', async (request, response, next) => {
  try {
    const input = registration.parse(request.body);
    const { password, ...profile } = input;
    const user = await prisma.user.create({
      data: { ...profile, passwordHash: await bcrypt.hash(password, 12) },
      select: { id: true, name: true, email: true, mobile: true, role: true },
    });
    response.status(201).json(session(user));
  } catch (error) { next(error); }
});

authRouter.post('/login', async (request, response, next) => {
  try {
    const input = credentials.parse(request.body);
    const record = await prisma.user.findUnique({ where: { email: input.email } });
    if (!record || !(await bcrypt.compare(input.password, record.passwordHash))) {
      return response.status(401).json({ message: 'Invalid email or password' });
    }
    const { passwordHash: _, ...user } = record;
    response.json(session(user));
  } catch (error) { next(error); }
});

authRouter.get('/me', authenticate, async (request: AuthRequest, response, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: request.user!.id }, select: { id: true, name: true, email: true, mobile: true, role: true },
    });
    response.json(user);
  } catch (error) { next(error); }
});