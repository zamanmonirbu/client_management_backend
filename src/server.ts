// src/server.ts
import dotenv from 'dotenv';
import app from './app';
import { connectDB, disconnectDB } from './database/connection';
import { ENV } from './config/env';

dotenv.config();

const PORT = ENV.PORT;

const server = app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  await connectDB();
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await disconnectDB();
  server.close(() => process.exit(0));
});
