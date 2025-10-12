// src/modules/client/client.repository.ts
import prisma from '../../database/connection';
import { ClientCreateDTO, ClientUpdateDTO } from './client.types';

export const createClient = async (data: ClientCreateDTO) => {
  return prisma.client.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      dob: new Date(data.dob),
      email: data.email,
      cell: data.cell,
      companyName: data.companyName,
      price: data.price,
      comments: data.comments ?? null,
    },
  });
};

export const findAllClients = async (skip = 0, take = 10, sortOrder: 'asc' | 'desc' = 'desc') => {
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

export const updateClientById = async (id: string , data: ClientUpdateDTO) => {
  const payload: any = { ...data };
  if (payload.dob) payload.dob = new Date(payload.dob);
  return prisma.client.update({ where: { id }, data: payload });
};

export const deleteClientById = async (id: string) => {
  return prisma.client.delete({ where: { id } });
};
