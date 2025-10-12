// src/modules/client/client.validator.ts
import { z } from 'zod';

export const clientCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  dob: z.string().refine(val => !Number.isNaN(Date.parse(val)), { message: 'Invalid date' }),
  email: z.string().email('Invalid email'),
  cell: z.string().min(5, 'Invalid phone'),
  companyName: z.string().min(1),
  price: z.string().min(1),
  comments: z.string().optional().nullable(),
});

export const clientUpdateSchema = clientCreateSchema.partial();
