// src/config/env.ts
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

const requiredValues = [
  'PORT',
  'NODE_ENV',
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'DB_PORT',
  'JWT_SECRET',
  'REFRESH_SECRET',
  'ACCESS_TOKEN_EXPIRE',
  'REFRESH_TOKEN_EXPIRE',
];

const missingValues = requiredValues.filter((key) => !(key in process.env));

if (missingValues.length > 0) {
  throw new Error(`The following environment variables are required: ${missingValues.join(', ')}`);
}

export const ENV = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DB_HOST: process.env.DB_HOST!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_NAME: process.env.DB_NAME!,
  DB_PORT: Number(process.env.DB_PORT),
  JWT_SECRET: process.env.JWT_SECRET!,
  REFRESH_SECRET: process.env.REFRESH_SECRET!,
  ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE!,
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE!,
};
