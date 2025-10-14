// src/modules/user/user.controller.ts
import { NextFunction, Request, Response } from 'express';
import * as service from './user.service';
import { generateResponse } from '../../utils/generateResponse';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.registerService(req.body);
    return generateResponse(res, 201, 'User registered successfully', result);
  } catch (err: any) {
    next(err);
  }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.loginService(req.body);
    return generateResponse(res, 200, 'User logged in successfully', result);
  } catch (err: any) {
    next(err);
  }
};

export const refreshController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.refreshTokenService(req.body);
    return generateResponse(res, 200, 'Token refreshed successfully', result);
  } catch (err: any) {
    next(err);
  }
};

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    await service.logoutService(userId);
    return generateResponse(res, 200, 'User logged out successfully');
  } catch (err: any) {
    next(err);
  }
};

export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await service.getUserByIdService(userId);
    return generateResponse(res, 200, 'User fetched successfully', user);
  } catch (err: any) {
    next(err);
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
    next(err);
  }
};

export const getByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await service.getUserByIdService(userId);
    return generateResponse(res, 200, 'User fetched successfully', user);
  } catch (err: any) {
    next(err);
  }
};

export const updateController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const updated = await service.updateUserService(userId, req.body);
    return generateResponse(res, 200, 'User updated successfully', updated);
  } catch (err: any) {
    next(err);
  }
};
export const deleteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    await service.deleteUserService(userId);
    return generateResponse(res, 200, 'User deleted successfully');
  } catch (err: any) {
    next(err);
  }
};
