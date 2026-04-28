import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { events } from './events.js';
import { users } from './users.js';

export const eventMessages = pgTable('event_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  attachments: jsonb('attachments'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
