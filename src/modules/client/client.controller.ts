// src/modules/client/client.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from './client.service';
import { ClientCreateDTO } from './client.types';
import { generateResponse } from '../../utils/generateResponse';
import { AppError } from '../../utils/appError';

export const createClient = async (req: Request, res: Response) => {
  try {
    const payload: ClientCreateDTO = req.body;
    const client = await service.createClientService(payload);
    return generateResponse(res, 201, 'Client created successfully', client);
  } catch (err: any) {
    if (err instanceof AppError) {
      return generateResponse(res, err.statusCode || 500, err.message);
    }
    return generateResponse(res, 500, 'Internal server error');
  }
};

export const getClients = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

    const result = await service.listClientsService(page, limit, sortOrder);
    return generateResponse(res, 200, 'Clients fetched successfully', result);
  } catch (err: any) {
    if (err instanceof AppError) {
      return generateResponse(res, err.statusCode || 500, err.message);
    }
    return generateResponse(res, 500, 'Internal server error');
  }
};

export const getClient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const client = await service.getClientService(id);
    return generateResponse(res, 200, 'Client fetched successfully', client);
  } catch (err: any) {
    if (err instanceof AppError) {
      return generateResponse(res, err.statusCode || 500, err.message);
    }
    return generateResponse(res, 500, 'Internal server error');
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updated = await service.updateClientService(id, req.body);
    return generateResponse(res, 200, 'Client updated successfully', updated);
  } catch (err: any) {
    if (err instanceof AppError) {
      return generateResponse(res, err.statusCode || 500, err.message);
    }
    return generateResponse(res, 500, 'Internal server error');
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await service.deleteClientService(id);
    return generateResponse(res, 200, 'Client deleted successfully');
  } catch (err: any) {
    if (err instanceof AppError) {
      return generateResponse(res, err.statusCode || 500, err.message);
    }
    return generateResponse(res, 500, 'Internal server error');
  }
};