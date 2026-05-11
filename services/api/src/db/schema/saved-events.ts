import { pgTable, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { events } from './events.js';

export const savedEvents = pgTable(
  'saved_events',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.eventId] }),
  ]
);
