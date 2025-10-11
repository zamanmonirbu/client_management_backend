// src/modules/user/user.repository.ts
// src/modules/user/user.repository.ts
import prisma from '../../database/connection';
import { UserCreateDTO, UserUpdateDTO } from "./user.types";

export const createUser = async (data: UserCreateDTO) => {
  return prisma.user.create({ data });
};

export const findAllUsers = async () => {
  return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
};

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({ where: { id } });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const updateUserById = async (id: number, data: UserUpdateDTO) => {
  return prisma.user.update({ where: { id }, data });
};

export const deleteUserById = async (id: number) => {
  return prisma.user.delete({ where: { id } });
};
