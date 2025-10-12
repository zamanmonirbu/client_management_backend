// src/modules/user/user.repository.ts
import prisma from "../../database/connection";
import { UserCreateDTO, UserUpdateDTO } from "./user.types";

 export const createUser = async (data: UserCreateDTO) => {
    return prisma.user.create({ data });
  };

  export const updateRefreshToken = async (userId: string, refreshToken: string | null) => {
    return prisma.user.update({ where: { id: userId }, data: { refreshToken } });
  };

export const findAllUsers = async ({ page, limit, sortOrder }: { page: number, limit: number, sortOrder: 'asc' | 'desc' }) => {
  const skip = (page - 1) * limit;

  return prisma.user.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: sortOrder },
  });
};


  export const findById = async (id: string) => {
    return prisma.user.findUnique({ where: { id } });
  };

  export const findByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  };

  export const updateUser = async (id: string, data: UserUpdateDTO) => {
    return prisma.user.update({ where: { id }, data });
  };

  export const deleteUser = async (id: string) => {
    return prisma.user.delete({ where: { id } });
  };

