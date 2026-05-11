import { pgTable, uuid, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { communities } from './communities.js';

export const eventSeries = pgTable('event_series', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizerType: text('organizer_type', { enum: ['user', 'community'] })
    .notNull()
    .default('user'),
  hostId: uuid('host_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  communityId: uuid('community_id').references(() => communities.id, {
    onDelete: 'set null',
  }),
  title: text('title').notNull(),
  slug: text('slug').unique(),
  description: text('description'),
  coverImageUrl: text('cover_image_url'),
  category: text('category', {
    enum: [
      'networking',
      'party',
      'workshop',
      'conference',
      'social',
      'sports',
      'other',
    ],
  })
    .notNull()
    .default('other'),
  visibility: text('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('public'),
  recurrenceHint: text('recurrence_hint', {
    enum: ['weekly', 'biweekly', 'monthly', 'custom'],
  }),
  settings: jsonb('settings').notNull().default({}),
  subscriberCount: integer('subscriber_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
