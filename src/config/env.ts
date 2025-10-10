import dotenv from 'dotenv';
dotenv.config();

const requiredValues = ['PORT', 'NODE_ENV', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PORT'];

const missingValues = requiredValues.filter(key => !(key in process.env));

if (missingValues.length > 0) {
  throw new Error(`The following environment variables are required: ${missingValues.join(', ')}`);
}

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_HOST: process.env.DB_HOST!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_NAME: process.env.DB_NAME!,
  DB_PORT: Number(process.env.DB_PORT) || 3306,
};

