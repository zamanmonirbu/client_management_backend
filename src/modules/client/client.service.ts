// src/modules/client/client.service.ts
import * as repo from './client.repository';
import { ClientCreateDTO, ClientUpdateDTO } from './client.types';

export const createClientService = async (payload: ClientCreateDTO) => {
  // business rules example: enforce unique email handled by DB; add further checks or events here
  const created = await repo.createClient(payload);
  return created;
};

export const listClientsService = async () => {
  const clients = await repo.findAllClients();
  return clients;
};

export const getClientService = async (id: number) => {
  const client = await repo.findClientById(id);
  if (!client) throw new Error('Client not found');
  return client;
};

export const updateClientService = async (id: number, payload: ClientUpdateDTO) => {
  // possible business checks before update
  const updated = await repo.updateClientById(id, payload);
  return updated;
};

export const deleteClientService = async (id: number) => {
  await repo.deleteClientById(id);
  return;
};
