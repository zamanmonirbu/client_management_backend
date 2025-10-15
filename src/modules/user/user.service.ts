// src/modules/user/user.service.ts
import bcrypt from 'bcrypt';
import * as repo from './user.repository';
import { UserCreateDTO, UserLoginDTO, UserUpdateDTO } from './user.types';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../middleware/security';
import { AppError } from '../../utils/appError';
import { handlePrismaError } from '../../utils/prismaErrorHandler';

export const sanitizeUser = (user: any) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

export const registerService = async (data: UserCreateDTO) => {
  try {
    const existingUser = await repo.findByEmail(data.email);
    if (existingUser) throw new AppError('Email already exists', 409);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await repo.createUser({ ...data, password: hashedPassword });
    
    return { user: sanitizeUser(user) };
  } catch (error: any) {
    handlePrismaError(error);
    throw new AppError('Failed to register user', 500);
  }
};

export const loginService = async (data: UserLoginDTO) => {
  try {
    const user = await repo.findByEmail(data.email);
    if (!user) throw new AppError('User not found', 401);

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new AppError('Invalid credentials', 401);

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    const updated = await repo.updateRefreshToken(user.id, refreshToken);

    return {
      user: sanitizeUser(updated),
      accessToken,
    };
  } catch (error: any) {
    handlePrismaError(error);
    throw new AppError('Login failed', 500);
  }
};

export const refreshTokenService = async (data: { refreshToken: string }) => {
  try {
    const { id } = verifyRefreshToken(data.refreshToken);
    if (!id) throw new AppError('Invalid refresh token', 401);

    const user = await repo.findById(id);
    if (!user) throw new AppError('User not found', 404);
    if (user.refreshToken !== data.refreshToken) throw new AppError('Invalid refresh token', 401);

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    await repo.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    handlePrismaError(error);
    throw new AppError('Token refresh failed', 500);
  }
};

export const logoutService = async (id: string) => {
  try {
    const user = await repo.findById(id);
    if (!user) throw new AppError('User not found', 404);

    await repo.updateRefreshToken(user.id, null);
    return;
  } catch (error: any) {
    handlePrismaError(error);
    throw new AppError('Logout failed', 500);
  }
};

export const getAllUsersService = async (
  page: number,
  limit: number,
  sortOrder: 'asc' | 'desc'
) => {
  try {
    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) {
      throw new AppError('Limit must be between 1 and 100', 400);
    }

    const users = await repo.findAllUsers({ page, limit, sortOrder });
    return users.map(sanitizeUser);
  } catch (error: any) {
    handlePrismaError(error);
    throw new AppError('Failed to fetch users', 500);
  }
};

export const getUserByIdService = async (id: string) => {
  try {
    const user = await repo.findById(id);
    if (!user) throw new AppError('User not found', 404);
    return sanitizeUser(user);
  } catch (error: any) {
    handlePrismaError(error);
    throw new AppError('Failed to fetch user', 500);
  }
};

export const updateUserService = async (id: string, data: UserUpdateDTO) => {
  try {
    const existingUser = await repo.findById(id);
    if (!existingUser) throw new AppError('User not found', 404);

    if (data.email && data.email !== existingUser.email) {
      const emailExists = await repo.findByEmail(data.email);
      if (emailExists) throw new AppError('Email already exists', 409);
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await repo.updateUser(id, data);
    return sanitizeUser(updated);
  } catch (error: any) {
    handlePrismaError(error);
    throw new AppError('Failed to update user', 500);
  }
};

export const deleteUserService = async (id: string) => {
  try {
    const user = await repo.findById(id);
    if (!user) throw new AppError('User not found', 404);
    
    await repo.deleteUser(id);
    return;
  } catch (error: any) {
    handlePrismaError(error);
    throw new AppError('Failed to delete user', 500);
  }
};