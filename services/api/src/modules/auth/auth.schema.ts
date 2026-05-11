import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).max(50),
  lastName: z.string().max(50).optional(),
});

export const signInEmailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const signInPhoneSchema = z.object({
  phone: z.string().min(1),
  password: z.string().min(1),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().max(50).nullable().optional(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores').nullable().optional(),
  tagline: z.string().max(100).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  phone: z.string().nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  state: z.string().max(100).nullable().optional(),
  country: z.string().max(100).nullable().optional(),
  userData: z.record(z.unknown()).nullable().optional(),
});

export const searchUsersSchema = z.object({
  query: z.string().min(1).max(100),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInEmailInput = z.infer<typeof signInEmailSchema>;
export type SignInPhoneInput = z.infer<typeof signInPhoneSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
