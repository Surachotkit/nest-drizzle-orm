import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export const updateUserSchema = createUserSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const idSchema = z.coerce.number().int().positive();
