import dotenv from 'dotenv';
import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { authRouter } from './routes/auth.js';
import { publicRouter } from './routes/public.js';
import { donationRouter } from './routes/donations.js';
import { adminRouter } from './routes/admin.js';

dotenv.config({ path: new URL('../.env', import.meta.url) });

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters');

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173').split(',').map((origin) => origin.trim());
app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '100kb' }));
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: 15 * 60_000, limit: 300 }));
app.use('/api/auth', authRouter);
app.use('/api/public', publicRouter);
app.use('/api/donations', donationRouter);
app.use('/api/admin', adminRouter);
app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));
app.use((_request, response) => response.status(404).json({ message: 'Route not found' }));

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) return response.status(400).json({ message: 'Invalid input', issues: error.flatten().fieldErrors });
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return response.status(409).json({ message: 'That record already exists' });
  console.error(error);
  response.status(500).json({ message: 'Internal server error' });
};
app.use(errorHandler);

export default app;