// src/modules/user/user.service.ts
import bcrypt from "bcrypt";
import { userRepository } from "./user.repository";
import { UserCreateDTO, UserLoginDTO, UserUpdateDTO } from "./user.types";
import { generateAccessToken, generateRefreshToken } from "../../middleware/security";

export const userService = {
  async register(data: UserCreateDTO) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await userRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    return { user, accessToken, refreshToken };
  },

  async login(data: UserLoginDTO) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    return { user, accessToken, refreshToken };
  },

  async updateUser(id: number, data: UserUpdateDTO) {
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    return await userRepository.updateUser(id, data);
  },

  async deleteUser(id: number) {
    return await userRepository.deleteUser(id);
  },
};
