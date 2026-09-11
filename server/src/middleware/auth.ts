import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: { id: string; role: Role };
}

export function authenticate(request: AuthRequest, response: Response, next: NextFunction) {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return response.status(401).json({ message: 'Authentication required' });
  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: Role };
    next();
  } catch {
    response.status(401).json({ message: 'Invalid or expired session' });
  }
}

export function authorize(...roles: Role[]) {
  return (request: AuthRequest, response: Response, next: NextFunction) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return response.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
}