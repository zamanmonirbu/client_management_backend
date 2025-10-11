// src/modules/user/user.controller.ts
import { Request, Response } from "express";
import { userService } from "./user.service";

export const userController = {
  async register(req: Request, res: Response) {
    try {
      const result = await userService.register(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const result = await userService.login(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const userId = Number(req.params.id);
      const updated = await userService.updateUser(userId, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const userId = Number(req.params.id);
      await userService.deleteUser(userId);
      res.json({ message: "User deleted successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
};
