import { z } from 'zod';
import { USER_ENUM } from '../../enum/user.enum';

const PASSWORD = {
  min: 8,
  upper: /[A-Z]/,
  number: /[0-9]/,
  special: /[^A-Za-z0-9]/, // any special char
  // or stricter: /[!@#$%]/,
};

export const createUserZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name is too long'),

  email: z.string().trim().email('Please provide a valid email'),

  password: z
    .string()
    .min(PASSWORD.min, `Password minimum ${PASSWORD.min} character`)
    .regex(
      PASSWORD.upper,
      'Password must contain at least one uppercase letter'
    )
    .regex(PASSWORD.number, 'Password must contain at least one number')
    .regex(
      PASSWORD.special,
      'Password must contain at least one special character'
    ),

  age: z.coerce
    .number()
    .int('Age must be an integer')
    .min(13, 'min age 13')
    .max(150, 'Age invalid'),

  contact: z
    .string()
    .regex(/^\+?\d{10,15}$/, 'Phone number must be valid (e.g. +88017xxxxxxxx)')
    .optional(),

  role: z.nativeEnum(USER_ENUM).optional().default(USER_ENUM.USER),
});

export const updateUserZodSchema = createUserZodSchema
  .partial()
  .omit({ password: true });

export const userParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  userParamsSchema,
};
