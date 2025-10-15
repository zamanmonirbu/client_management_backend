// src/modules/client/client.service.ts
import * as repo from './client.repository';
import { ClientCreateDTO, ClientUpdateDTO } from './client.types';
import { AppError } from '../../utils/appError';
import { Prisma } from '@prisma/client';
import { handlePrismaError } from '../../utils/prismaErrorHandler';

const MAX_LIMIT = 100;

export const createClientService = async (payload: ClientCreateDTO) => {
  try {
    const existingClient = await repo.findClientByEmail(payload.email);
    if (existingClient) {
      throw new AppError('Client with this email already exists', 409);
    }

    if (payload.dob && typeof payload.dob === 'string') {
      payload.dob = new Date(payload.dob);
      if (isNaN(payload.dob.getTime())) {
        throw new AppError('Invalid date format for dob', 400);
      }
    }

    const created = await repo.createClient(payload);
    return created;
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      handlePrismaError(error);
    }
    
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || 'Failed to create client', 500);
  }
};

export const listClientsService = async (
  page = 1,
  limit = 10,
  sortOrder: 'asc' | 'desc' = 'desc'
) => {
  try {
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
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      handlePrismaError(error);
    }
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || 'Failed to fetch clients', 500);
  }
};

export const getClientService = async (id: string) => {
  try {
    const client = await repo.findClientById(id);
    if (!client) {
      throw new AppError('Client not found', 404);
    }
    return client;
  } catch (error: any) {
    handlePrismaError(error);
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || 'Failed to fetch client', 500);
  }
};

export const updateClientService = async (id: string, payload: ClientUpdateDTO) => {
  try {
    const client = await repo.findClientById(id);
    if (!client) {
      throw new AppError('Client not found', 404);
    }

    if (payload.email && payload.email !== client.email) {
      const existingClient = await repo.findClientByEmail(payload.email);
      if (existingClient) {
        throw new AppError('Client with this email already exists', 409);
      }
    }

    if (payload.dob && typeof payload.dob === 'string') {
      payload.dob = new Date(payload.dob);
    }

    const updated = await repo.updateClientById(id, payload);
    return updated;
  } catch (error: any) {
    handlePrismaError(error);
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || 'Failed to update client', 500);
  }
};

export const deleteClientService = async (id: string) => {
  try {
    const client = await repo.findClientById(id);
    if (!client) {
      throw new AppError('Client not found', 404);
    }

    await repo.deleteClientById(id);
    return;
  } catch (error: any) {
    handlePrismaError(error);
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || 'Failed to delete client', 500);
  }
};
