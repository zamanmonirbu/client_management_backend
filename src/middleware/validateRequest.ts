// src/middleware/validateRequest.ts
import { ZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

export default (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err: any) {
          const issues = err.errors?.map((e: any) => ({
        path: e.path.join('.'),
        message: e.message,
      })) || [{ message: err.message }];
    res.status(400).json({ errors: issues });
    }
    };
