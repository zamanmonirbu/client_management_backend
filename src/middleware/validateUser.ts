// src/middleware/validateUser.ts
import { verifyAccessToken } from './security';
import * as service from '../modules/user/user.service';
import { Request, Response, NextFunction } from 'express';
import { generateResponse } from '../utils/generateResponse';
import { AppError } from '../utils/appError';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return generateResponse(res, 401, 'No token provided');
    }

    const token = authHeader.substring(7);
    const user = await validateUserByToken(token);
    req.user = user;
    next();
  } catch (err: any) {
    return generateResponse(res, 401, err.message || 'Invalid token');
  }
};

export const validateUserByToken = async (token: string) => {
  try {
    const { id } = verifyAccessToken(token);
    const user = await service.getUserByIdService(id);
    if (!user) {
      throw new AppError('User not found', 401);
    }
    return user;
  } catch (err: any) {
    throw new AppError('Invalid token', 401);
  }
};