// src/utils/prismaErrorHandler.ts
import { Prisma } from '@prisma/client';
import { AppError } from './appError';

export const handlePrismaError = (error: any): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const target = error.meta?.target as string[];
      if (target?.includes('email') || target?.includes('User_email_key')) {
        throw new AppError('Email already exists', 409);
      }
      if (target?.includes('Client_email_key')) {
        throw new AppError('Client email already exists', 409);
      }
      throw new AppError(`Duplicate field value: ${target?.join(', ')}`, 409);
    }

    if (error.code === 'P2025') {
      throw new AppError('Record not found', 404);
    }

    if (error.code === 'P2003') {
      throw new AppError('Foreign key constraint failed', 400);
    }

    if (error.code === 'P2000') {
      throw new AppError('Invalid input data', 400);
    }

    if (error.code === 'P2034') {
      throw new AppError('Operation cancelled', 400);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new AppError('Invalid input data', 400);
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    throw new AppError('Database connection error', 503);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    throw new AppError('Database operation failed', 500);
  }

  throw error;
};