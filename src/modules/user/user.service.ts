import { verifyRefreshToken } from './../../middleware/security';
// src/modules/user/user.service.ts
import bcrypt from "bcrypt";
import * as repo from "./user.repository";
import { UserCreateDTO, UserLoginDTO, UserUpdateDTO } from "./user.types";
import { generateAccessToken, generateRefreshToken } from "../../middleware/security";

export const sanitizeUser = (user: any) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

export const registerService = async (data: UserCreateDTO) => {
  const existingUser = await repo.findByEmail(data.email);
  if (existingUser) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await repo.createUser({ ...data, password: hashedPassword });

  return { user: sanitizeUser(user) };
};

export const loginService = async (data: UserLoginDTO) => {
  const user = await repo.findByEmail(data.email);
  if (!user) throw new Error("User not found");

  
  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) throw new Error("Invalid credentials");
  
  if(user.role !== "ADMIN") throw new Error("Access denied");
  
  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  const updated = await repo.updateRefreshToken(user.id, refreshToken);

  return {
    user: sanitizeUser(updated),
    accessToken
  };
};

export const refreshTokenService = async (data: { refreshToken: string }) => {

  const { id } = verifyRefreshToken(data.refreshToken);
  if (!id) throw new Error("Invalid refresh token");

  const user = await repo.findById(id);

  if (!user) throw new Error("User not found");
  if (user.refreshToken !== data.refreshToken) throw new Error("Invalid refresh token");

  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  await repo.updateRefreshToken(user.id, refreshToken);

  return {
    accessToken,
    refreshToken,
  };
};

export const logoutService = async (id: string) => {

  const user = await repo.findById(id);
  if (!user) throw new Error("User not found");

  await repo.updateRefreshToken(user.id, null);
  return;
};

export const getAllUsersService = async (page: number, limit: number, sortOrder: 'asc' | 'desc') => {
  const users = await repo.findAllUsers({ page, limit, sortOrder });
  return users.map(sanitizeUser);
};

export const getUserByIdService = async (id: string) => {
  const user = await repo.findById(id);
  if (!user) throw new Error("User not found");
  return sanitizeUser(user);
};

export const updateUserService = async (id: string, data: UserUpdateDTO) => {
  if (data.password) data.password = await bcrypt.hash(data.password, 10);
  const updated = await repo.updateUser(id, data);
  return sanitizeUser(updated);
};

export const deleteUserService = async (id: string) => {
  await repo.deleteUser(id);
  return;
};
