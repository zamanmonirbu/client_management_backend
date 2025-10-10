// src/routes/index.ts
import express from 'express';
import clientRoutes from '../modules/client/client.routes';

const router = express.Router();

router.use('/clients', clientRoutes);

export default router;
