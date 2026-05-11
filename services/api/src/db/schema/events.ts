import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  numeric,
  jsonb,
  boolean,
} from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { communities } from './communities.js';
import { eventSeries } from './event-series.js';

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  hostId: uuid('host_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  communityId: uuid('community_id').references(() => communities.id, {
    onDelete: 'set null',
  }),
  seriesId: uuid('series_id').references(() => eventSeries.id, {
    onDelete: 'set null',
  }),
  organizerType: text('organizer_type', { enum: ['user', 'community'] })
    .notNull()
    .default('user'),
  title: text('title').notNull(),
  tagline: text('tagline'),
  description: text('description'),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }),
  timezone: text('timezone').notNull().default('UTC'),
  status: text('status', {
    enum: ['draft', 'published', 'cancelled', 'completed'],
  })
    .notNull()
    .default('draft'),
  location: text('location'),
  latitude: numeric('latitude'),
  longitude: numeric('longitude'),
  address: text('address'),
  cityRegion: text('city_region'),
  isOnline: boolean('is_online').notNull().default(false),
  virtualLink: text('virtual_link'),
  visibility: text('visibility', { enum: ['public', 'private', 'invite_only'] })
    .notNull()
    .default('private'),
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
  coverImageUrl: text('cover_image_url'),
  capacityLimit: integer('capacity_limit'),
  settings: jsonb('settings').notNull().default({}),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
