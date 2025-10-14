// src/types/express.d.ts
import { User } from '../modules/user/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
