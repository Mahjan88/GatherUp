import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { events } from './events.js';
import { users } from './users.js';

export const eventMedia = pgTable('event_media', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  uploaderId: uuid('uploader_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  mediaUrl: text('media_url').notNull(),
  mediaType: text('media_type', { enum: ['image', 'video'] }).notNull(),
  caption: text('caption'),
  thumbnailUrl: text('thumbnail_url'),
  metadata: jsonb('metadata').notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
