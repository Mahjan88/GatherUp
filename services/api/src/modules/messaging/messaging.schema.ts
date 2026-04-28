import { z } from 'zod';

export const sendEventMessageSchema = z.object({
  content: z.string().min(1).max(5000),
  attachments: z.any().nullable().optional(),
});

export const sendPrivateMessageSchema = z.object({
  recipientId: z.string().uuid(),
  content: z.string().min(1).max(5000),
});

export const messagesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(50),
  before: z.string().datetime().optional(),
});

export type SendEventMessageInput = z.infer<typeof sendEventMessageSchema>;
export type SendPrivateMessageInput = z.infer<typeof sendPrivateMessageSchema>;
