import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1).max(100),
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
  fullName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  phone: z.string().nullable().optional(),
});

export const searchUsersSchema = z.object({
  query: z.string().min(1).max(100),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInEmailInput = z.infer<typeof signInEmailSchema>;
export type SignInPhoneInput = z.infer<typeof signInPhoneSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
