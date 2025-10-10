import { Request, Response, NextFunction } from 'express';
import * as service from './client.service';
import { ClientCreateDTO } from './client.types';
import { generateResponse } from '../../utils/generateResponse';

export const createClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload: ClientCreateDTO = req.body;
    const client = await service.createClientService(payload);
    return generateResponse(res, 201, 'Client created successfully', client);
  } catch (err) {
    next(err);
  }
};

export const getClients = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await service.listClientsService();
    return generateResponse(res, 200, 'Clients fetched successfully', clients);
  } catch (err) {
    next(err);
  }
};

export const getClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const client = await service.getClientService(id);
    return generateResponse(res, 200, 'Client fetched successfully', client);
  } catch (err) {
    next(err);
  }
};

export const updateClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const updated = await service.updateClientService(id, req.body);
    return generateResponse(res, 200, 'Client updated successfully', updated);
  } catch (err) {
    next(err);
  }
};

export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await service.deleteClientService(id);
    return generateResponse(res, 200, 'Client deleted successfully');
  } catch (err) {
    next(err);
  }
};
