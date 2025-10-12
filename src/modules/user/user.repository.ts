// src/modules/user/user.repository.ts

import prisma from "../../database/connection";
import { UserCreateDTO, UserUpdateDTO } from "./user.types";

 export const createUser = async (data: UserCreateDTO) => {
    return prisma.user.create({ data });
  };

 export const findAllUsers = async () => {
    return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  };

  export const findById = async (id: number) => {
    return prisma.user.findUnique({ where: { id } });
  };

  export const findByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  };

  export const updateUser = async (id: number, data: UserUpdateDTO) => {
    return prisma.user.update({ where: { id }, data });
  };

  export const deleteUser = async (id: number) => {
    return prisma.user.delete({ where: { id } });
  };

