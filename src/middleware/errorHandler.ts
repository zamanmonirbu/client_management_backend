// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const status = err?.status || 500;
  res.status(status).json({
    message: err?.message || 'Internal Server Error',
    ...(ENV.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
