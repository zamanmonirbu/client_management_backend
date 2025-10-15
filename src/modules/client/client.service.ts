// src/modules/client/client.service.ts
import * as repo from './client.repository';
import { ClientCreateDTO, ClientUpdateDTO } from './client.types';
import { AppError } from '../../utils/appError';

const MAX_LIMIT = 100;

export const createClientService = async (payload: ClientCreateDTO) => {
  try {
    const created = await repo.createClient(payload);
    return created;
  } catch (error: any) {
    throw new AppError(`Failed to create client: ${error.message}`, 500);
  }
};

export const listClientsService = async (
  page = 1,
  limit = 10,
  sortOrder: 'asc' | 'desc' = 'desc'
) => {
  if (page < 1) page = 1;
  if (limit < 1 || limit > MAX_LIMIT) {
    throw new AppError(`Limit must be between 1 and ${MAX_LIMIT}`, 400);
  }

  const skip = (page - 1) * limit;
  const { clients, total } = await repo.findAllClients(skip, limit, sortOrder);
  const totalPages = Math.ceil(total / limit);
  
  return {
    data: clients,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      sortOrder,
    },
  };
};

export const getClientService = async (id: string) => {
  const client = await repo.findClientById(id);
  if (!client) {
    throw new AppError('Client not found', 404);
  }
  return client;
};

export const updateClientService = async (id: string, payload: ClientUpdateDTO) => {
  const client = await repo.findClientById(id);
  if (!client) {
    throw new AppError('Client not found', 404);
  }
  
  const updated = await repo.updateClientById(id, payload);
  return updated;
};

export const deleteClientService = async (id: string) => {
  const client = await repo.findClientById(id);
  if (!client) {
    throw new AppError('Client not found', 404);
  }
  
  await repo.deleteClientById(id);
  return;
};