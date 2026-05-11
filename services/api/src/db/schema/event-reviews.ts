import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  unique,
} from 'drizzle-orm/pg-core';
import { events } from './events.js';
import { users } from './users.js';

export const eventReview = pgTable(
  'event_review',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [unique().on(table.eventId, table.userId)]
);
