// src/types/express.d.ts
import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role?: User['role'];
      };
    }
  }
}

export {};