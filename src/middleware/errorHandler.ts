import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { ZodError } from 'zod';
import { ENV } from '../config/env';

export const errorHandler = (
  err: Error | AppError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error Details:', {
    name: err.name,
    message: err.message,
    stack: ENV.NODE_ENV === 'development' ? err.stack : undefined,
  });

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
  } else {
    message = err.message || 'Internal Server Error';
  }

  const response: Record<string, any> = {
    status: false,
    statusCode,
    message,
    ...(ENV.NODE_ENV === 'development' && statusCode === 500
      ? {
          stack: err.stack,
          name: err.name,
        }
      : {}),
    ...(err instanceof ZodError
      ? {
          errors: err.issues, 
        }
      : {}),
  };

  res.status(statusCode).json(response);
};
