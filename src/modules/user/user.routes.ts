// src/modules/user/user.routes.ts

import { Router } from "express";
import * as controller from "./user.controller";

const router = Router();

router.post("/register", controller.registerController);
router.post("/login", controller.loginController);
router.put("/:id", controller.updateController);
router.delete("/:id", controller.deleteController);

export default router;
