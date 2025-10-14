// src/middleware/validateUser.ts
import { verifyAccessToken } from './security';
import * as service from '../modules/user/user.service';
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const user = await validateUserByToken(token);
    req.user = user;
    next();
  } catch (err: any) {
    res.status(401).json({ message: err.message || 'Unauthorized' });
  }
};

export const validateUserByToken = async (token: string) => {
  try {
    const { id } = verifyAccessToken(token);
    const user = await service.getUserByIdService(id);
    return user;
  } catch (err: any) {
    throw new Error('Invalid token');
  }
};
