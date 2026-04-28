import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  jsonb,
} from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  hostId: uuid('host_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }),
  location: text('location'),
  locationCoords: jsonb('location_coords'),
  visibility: text('visibility', { enum: ['public', 'private', 'invite_only'] })
    .notNull()
    .default('private'),
  publicFields: jsonb('public_fields'),
  requiresApproval: boolean('requires_approval').default(false),
  coverImageUrl: text('cover_image_url'),

  // Extended fields
  address: text('address'),
  cityRegion: text('city_region'),
  category: text('category', {
    enum: ['networking', 'party', 'workshop', 'conference', 'social', 'sports', 'other'],
  })
    .notNull()
    .default('other'),

  galleryForAttendeesOnly: boolean('gallery_for_attendees_only').notNull().default(false),
  showAddressToInvitees: boolean('show_address_to_invitees').notNull().default(true),
  allowInviteOthers: boolean('allow_invite_others').notNull().default(true),

  guestListVisibility: text('guest_list_visibility', {
    enum: ['everyone', 'attendees', 'hidden'],
  })
    .notNull()
    .default('everyone'),

  rsvpRequired: boolean('rsvp_required').notNull().default(false),
  capacityLimit: integer('capacity_limit'),
  rsvpOption: text('rsvp_option', { enum: ['three-way', 'two-way'] })
    .notNull()
    .default('two-way'),
  rsvpDeadline: timestamp('rsvp_deadline', { withTimezone: true }),

  chatEnabled: boolean('chat_enabled').notNull().default(true),
  whoCanChat: text('who_can_chat', { enum: ['hosts', 'attendees'] })
    .notNull()
    .default('attendees'),
  whoCanPostMedia: text('who_can_post_media', { enum: ['hosts', 'attendees', 'everyone'] })
    .notNull()
    .default('attendees'),
  whoCanUpload: text('who_can_upload', { enum: ['attendees', 'hosts'] })
    .notNull()
    .default('attendees'),

  reminder24h: boolean('reminder_24h').notNull().default(true),
  reminder1h: boolean('reminder_1h').notNull().default(true),

  hasAgenda: boolean('has_agenda').notNull().default(false),
  agendaItems: jsonb('agenda_items').notNull().default([]),

  whatToBring: text('what_to_bring'),
  dressCode: text('dress_code'),
  accessibilityNotes: text('accessibility_notes'),
  ageRestriction: text('age_restriction'),

  ticketType: text('ticket_type', { enum: ['free', 'paid'] })
    .notNull()
    .default('free'),
  ticketPrice: numeric('ticket_price', { precision: 12, scale: 2 }),
  cancellationPolicy: text('cancellation_policy'),

  feedbackEnabled: boolean('feedback_enabled').notNull().default(false),
  feedbackVisibility: text('feedback_visibility', {
    enum: ['public', 'attendees_only', 'host_only'],
  })
    .notNull()
    .default('attendees_only'),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
