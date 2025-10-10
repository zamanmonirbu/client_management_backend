import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';


export const applySecurity = (app: express.Application) => {
    app.use(helmet());
    app.use(cors({ origin: '*', credentials: true }));
    app.use(express.json({ limit: '10kb' }));
    app.use(hpp());

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        message: 'Too many requests, please try again later.',
    });
    app.use(limiter);
};
