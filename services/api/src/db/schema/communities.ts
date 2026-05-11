import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const communities = pgTable('communities', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  description: text('description'),
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
  city: text('city'),
  visibility: text('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('public'),
  isDiscoverable: boolean('is_discoverable').notNull().default(true),
  memberCount: integer('member_count').notNull().default(0),
  settings: jsonb('settings').notNull().default({}),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
