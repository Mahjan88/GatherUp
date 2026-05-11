import { pgTable, uuid, boolean, timestamp } from 'drizzle-orm/pg-core';
import { eventSeries } from './event-series.js';
import { users } from './users.js';

export const eventSeriesSubscriptions = pgTable(
  'event_series_subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    seriesId: uuid('series_id')
      .notNull()
      .references(() => eventSeries.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    notify: boolean('notify').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  }
);
