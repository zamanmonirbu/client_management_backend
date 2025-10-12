// src/modules/user/user.service.ts

import bcrypt from "bcrypt";
import * as repo from "./user.repository";
import { UserCreateDTO, UserLoginDTO, UserUpdateDTO } from "./user.types";
import { generateAccessToken, generateRefreshToken } from "../../middleware/security";


export const registerService =  async (data: UserCreateDTO) => {
    const existingUser = await repo.findByEmail(data.email);
    if (existingUser) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await repo.createUser({
      ...data,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    return { user, accessToken, refreshToken };
  };

  export const loginService= async (data: UserLoginDTO) => {
    const user = await repo.findByEmail(data.email);
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    return { user, accessToken, refreshToken };
  };

  export const updateUserService = async (id: number, data: UserUpdateDTO) => {
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    return await repo.updateUser(id, data);
  };

  export const deleteUserService = async (id: number) => {
    return await repo.deleteUser(id);
  };

