// src/modules/client/client.service.ts
import * as repo from './client.repository';
import { ClientCreateDTO, ClientUpdateDTO } from './client.types';

export const createClientService = async (payload: ClientCreateDTO) => {
  const created = await repo.createClient(payload);
  return created;
};

export const listClientsService = async (
  page = 1,
  limit = 10,
  sortOrder: 'asc' | 'desc' = 'desc'
) => {
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
  if (!client) throw new Error('Client not found');
  return client;
};

export const updateClientService = async (id: string, payload: ClientUpdateDTO) => {
  const updated = await repo.updateClientById(id, payload);
  return updated;
};

export const deleteClientService = async (id: string) => {
  await repo.deleteClientById(id);
  return;
};
