// src/modules/user/user.routes.ts
import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);

export default router;
