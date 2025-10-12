// src/modules/user/user.routes.ts
import { Router } from "express";
import * as controller from "./user.controller";
import { authMiddleware } from "../../middleware/validateUser";
import validateRequest from "../../middleware/validateRequest";
import { userCreateSchema, userLoginSchema, userUpdateSchema, } from "./user.validator";

const router = Router();

router.post("/register", validateRequest(userCreateSchema), controller.registerController);
router.post("/login", validateRequest(userLoginSchema), controller.loginController);
router.post("/refresh", controller.refreshController);
router.post("/logout", authMiddleware, controller.logoutController);
router.get("/me", authMiddleware, controller.getMeController);
router.get("/", controller.getController);
router.get("/:id", controller.getByIdController);
router.put("/:id", validateRequest(userUpdateSchema), authMiddleware, controller.updateController);
router.delete("/:id", authMiddleware, controller.deleteController);

export default router;
