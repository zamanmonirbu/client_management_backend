// src/modules/user/user.controller.ts
import { NextFunction, Request, Response } from 'express';
import * as service from './user.service';
import { generateResponse } from '../../utils/generateResponse';
import { AppError } from '../../utils/appError';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.registerService(req.body);
    return generateResponse(res, 201, 'User registered successfully', result);
  } catch (err: any) {
    if (err instanceof AppError) {
      return generateResponse(res, err.statusCode || 500, err.message);
    }
    return generateResponse(res, 500, 'Internal server error');
  }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.loginService(req.body);
    return generateResponse(res, 200, 'User logged in successfully', result);
  } catch (err: any) {
    if (err instanceof AppError) {
      return generateResponse(res, err.statusCode || 500, err.message);
    }
    return generateResponse(res, 500, 'Internal server error');
  }
};

export const refreshController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.refreshTokenService(req.body);
    return generateResponse(res, 200, 'Token refreshed successfully', result);
  } catch (err: any) {
    if (err instanceof AppError) {
      return generateResponse(res, err.statusCode || 500, err.message);
    }
    return generateResponse(res, 500, 'Internal server error');
  }
};

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  
  console.log('req.user', req.user?.id);

  try {
    const userId = req.user?.id as string;
    await service.logoutService(userId);
    return generateResponse(res, 200, 'User logged out successfully');
  } catch (err: any) {
    if (err instanceof AppError) {
      return generateResponse(res, err.statusCode || 500, err.message);
    }
    return generateResponse(res, 500, 'Internal server error');
  }
};

export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return generateResponse(res, 401, 'Unauthorized');
    }
    const user = await service.getUserByIdService(userId);
    return generateResponse(res, 200, 'User fetched successfully', user);
  } catch (err: any) {
    if (err instanceof AppError) {
      return generateResponse(res, err.statusCode || 500, err.message);
    }
    return generateResponse(res, 500, 'Internal server error');
  }
};

export const getController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

    const result = await service.getAllUsersService(page, limit, sortOrder);
    return generateResponse(res, 200, 'Users fetched successfully', result);
  } catch (err: any) {
    if (err instanceof AppError) {
      return generateResponse(res, err.statusCode || 500, err.message);
    }
    return generateResponse(res, 500, 'Internal server error');
  }
};

export const getByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await service.getUserByIdService(userId);
    return generateResponse(res, 200, 'User fetched successfully', user);
  } catch (err: any) {
    if (err instanceof AppError) {
      return generateResponse(res, err.statusCode || 500, err.message);
    }
    return generateResponse(res, 500, 'Internal server error');
  }
};

export const updateController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const updated = await service.updateUserService(userId, req.body);
    return generateResponse(res, 200, 'User updated successfully', updated);
  } catch (err: any) {
    if (err instanceof AppError) {
      return generateResponse(res, err.statusCode || 500, err.message);
    }
    return generateResponse(res, 500, 'Internal server error');
  }
};

export const deleteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    await service.deleteUserService(userId);
    return generateResponse(res, 200, 'User deleted successfully');
  } catch (err: any) {
    if (err instanceof AppError) {
      return generateResponse(res, err.statusCode || 500, err.message);
    }
    return generateResponse(res, 500, 'Internal server error');
  }
};