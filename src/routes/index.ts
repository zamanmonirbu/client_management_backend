// src/routes/index.ts
import { Router } from "express";
import clientRoutes from "../modules/client/client.routes";
import userRoutes from "../modules/user/user.routes";

const router = Router();

router.use("/clients", clientRoutes);
router.use("/users", userRoutes);

export default router;

