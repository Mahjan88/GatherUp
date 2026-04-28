import { z } from 'zod';

export const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.string().min(1),
  data: z.record(z.unknown()),
});

export const notificationsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(50),
  unreadOnly: z.coerce.boolean().default(false),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
