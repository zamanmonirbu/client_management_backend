// src/app.ts
import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import allRoutes from './routes';
import { applySecurity } from './middleware/security';

const app = express();
applySecurity(app);

app.get('/', (_req, res) => res.json({ ok: true }));
app.use('/api/v1', allRoutes);


app.use(errorHandler);

export default app;
