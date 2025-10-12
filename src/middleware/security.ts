// src/middleware/security.ts
import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import jwt, { Secret } from 'jsonwebtoken';
import { ENV } from '../config/env';


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



export const generateAccessToken = ( payload: string | object | Buffer) => {

  return jwt.sign(payload, ENV.JWT_SECRET! as Secret, { expiresIn: ENV.ACCESS_TOKEN_EXPIRE  as any});
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, ENV.REFRESH_SECRET! as Secret, { expiresIn: ENV.REFRESH_TOKEN_EXPIRE as any});
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ENV.JWT_SECRET! as Secret);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, ENV.REFRESH_SECRET! as Secret);
};



