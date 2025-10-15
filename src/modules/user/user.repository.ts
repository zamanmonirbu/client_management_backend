// src/modules/user/user.repository.ts
import prisma from '../../database/connection';
import { UserCreateDTO, UserUpdateDTO } from './user.types';
import { handlePrismaError } from '../../utils/prismaErrorHandler';

export const createUser = async (data: UserCreateDTO) => {
  try {
    return prisma.user.create({ data });
  } catch (error: any) {
    handlePrismaError(error);
    throw error; 
  }
};

export const updateRefreshToken = async (userId: string, refreshToken: string | null) => {
  try {
    return prisma.user.update({ where: { id: userId }, data: { refreshToken } });
  } catch (error: any) {
    handlePrismaError(error);
    throw error;
  }
};

export const findAllUsers = async ({
  page,
  limit,
  sortOrder,
}: {
  page: number;
  limit: number;
  sortOrder: 'asc' | 'desc';
}) => {
  try {
    const skip = (page - 1) * limit;

    return prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: sortOrder },
    });
  } catch (error: any) {
    handlePrismaError(error);
    throw error;
  }
};

export const findById = async (id: string) => {
  try {
    return prisma.user.findUnique({ where: { id } });
  } catch (error: any) {
    handlePrismaError(error);
    throw error;
  }
};

export const findByEmail = async (email: string) => {
  try {
    return prisma.user.findUnique({ where: { email } });
  } catch (error: any) {
    handlePrismaError(error);
    throw error;
  }
};

export const updateUser = async (id: string, data: UserUpdateDTO) => {
  try {
    return prisma.user.update({ where: { id }, data });
  } catch (error: any) {
    handlePrismaError(error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    return prisma.user.delete({ where: { id } });
  } catch (error: any) {
    handlePrismaError(error);
    throw error;
  }
};