// src/modules/user/user.validator.ts
import { z } from 'zod';

export const userCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password should be at least 8 characters'),
  role: z.optional(z.enum(['ADMIN'])),
  userImage: z.optional(z.string().url('Invalid image URL')),
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password should be at least 8 characters'),
});

export const userUpdateSchema = userCreateSchema.partial();
