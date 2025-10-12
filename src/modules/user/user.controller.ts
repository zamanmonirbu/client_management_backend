// src/modules/user/user.controller.ts

import { Request, Response } from "express";
import * as service from "./user.service";


export const registerController = async (req: Request, res: Response) => {
    try {
      const result = await service.registerService(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  export const loginController = async (req: Request, res: Response) => {
    try {
      const result = await service.loginService(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  export const updateController = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.id);
      const updated = await service.updateUserService(userId, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  export const deleteController = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.id);
      await service.deleteUserService(userId);
      res.json({ message: "User deleted successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };
