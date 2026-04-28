import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().nullable().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().nullable().optional(),
  location: z.string().nullable().optional(),
  locationCoords: z
    .object({ latitude: z.number(), longitude: z.number() })
    .nullable()
    .optional(),
  visibility: z.enum(['public', 'private', 'invite_only']).default('private'),
  requiresApproval: z.boolean().default(false),
  coverImageUrl: z.string().url().nullable().optional(),
  address: z.string().nullable().optional(),
  cityRegion: z.string().nullable().optional(),
  category: z
    .enum(['networking', 'party', 'workshop', 'conference', 'social', 'sports', 'other'])
    .default('other'),
  galleryForAttendeesOnly: z.boolean().default(false),
  showAddressToInvitees: z.boolean().default(true),
  allowInviteOthers: z.boolean().default(true),
  guestListVisibility: z.enum(['everyone', 'attendees', 'hidden']).default('everyone'),
  rsvpRequired: z.boolean().default(false),
  capacityLimit: z.number().int().positive().nullable().optional(),
  rsvpOption: z.enum(['three-way', 'two-way']).default('two-way'),
  rsvpDeadline: z.string().datetime().nullable().optional(),
  chatEnabled: z.boolean().default(true),
  whoCanChat: z.enum(['hosts', 'attendees']).default('attendees'),
  whoCanPostMedia: z.enum(['hosts', 'attendees', 'everyone']).default('attendees'),
  whoCanUpload: z.enum(['attendees', 'hosts']).default('attendees'),
  reminder24h: z.boolean().default(true),
  reminder1h: z.boolean().default(true),
  hasAgenda: z.boolean().default(false),
  agendaItems: z.array(z.object({
    id: z.string(),
    time: z.string(),
    title: z.string(),
    icon: z.string(),
  })).default([]),
  whatToBring: z.string().nullable().optional(),
  dressCode: z.string().nullable().optional(),
  accessibilityNotes: z.string().nullable().optional(),
  ageRestriction: z.string().nullable().optional(),
  ticketType: z.enum(['free', 'paid']).default('free'),
  ticketPrice: z.number().nonnegative().nullable().optional(),
  cancellationPolicy: z.string().nullable().optional(),
  feedbackEnabled: z.boolean().default(false),
  feedbackVisibility: z.enum(['public', 'attendees_only', 'host_only']).default('attendees_only'),
});

export const updateEventSchema = createEventSchema.partial();

export const getEventsQuerySchema = z.object({
  visibility: z.enum(['public', 'private', 'invite_only']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  category: z.enum(['networking', 'party', 'workshop', 'conference', 'social', 'sports', 'other']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const inviteSchema = z.object({
  userId: z.string().uuid(),
});

export const respondInvitationSchema = z.object({
  status: z.enum(['joined', 'declined']),
});

export const memberActionSchema = z.object({
  userId: z.string().uuid(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type GetEventsQuery = z.infer<typeof getEventsQuerySchema>;
