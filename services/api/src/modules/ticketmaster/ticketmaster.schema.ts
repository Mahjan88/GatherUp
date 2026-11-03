import { z } from 'zod';

// Optional user location; results are then sorted nearest first
const nearSchema = z.object({
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
});

export const searchTicketmasterSchema = nearSchema.extend({
  keyword: z.string().trim().min(1).max(200),
  city: z.string().trim().max(100).optional(),
  countryCode: z.enum(['US', 'CA']).optional(),
  page: z.coerce.number().int().nonnegative().default(0),
  size: z.coerce.number().int().positive().max(50).default(20),
});

export const resolveTicketmasterUrlSchema = nearSchema.extend({
  url: z.string().trim().url().max(2000),
});

export const ticketmasterEventParamsSchema = z.object({
  id: z.string().regex(/^[A-Za-z0-9_-]{1,64}$/),
});

export type SearchTicketmasterQuery = z.infer<typeof searchTicketmasterSchema>;
export type NearLocation = z.infer<typeof nearSchema>;
