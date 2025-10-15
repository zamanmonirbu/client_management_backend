// src/modules/client/client.repository.ts
import prisma from '../../database/connection';
import { ClientCreateDTO, ClientUpdateDTO } from './client.types';

export const createClient = async (data: ClientCreateDTO) => {
  return prisma.client.create({ data });
};

export const findAllClients = async (
  skip: number,
  take: number,
  sortOrder: 'asc' | 'desc'
) => {
  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      skip,
      take,
      orderBy: { createdAt: sortOrder },
    }),
    prisma.client.count(),
  ]);
  return { clients, total };
};

export const findClientById = async (id: string) => {
  return prisma.client.findUnique({ where: { id } });
};

export const findClientByEmail = async (email: string) => {
  return prisma.client.findUnique({ where: { email } });
};

export const updateClientById = async (id: string, data: ClientUpdateDTO) => {
  return prisma.client.update({ where: { id }, data });
};

export const deleteClientById = async (id: string) => {
  return prisma.client.delete({ where: { id } });
};