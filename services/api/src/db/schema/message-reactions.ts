import { pgTable, uuid, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const messageReaction = pgTable(
  'message_reaction',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    messageId: uuid('message_id').notNull(),
    messageType: text('message_type', { enum: ['event', 'private'] }).notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    emoji: text('emoji').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique().on(table.messageId, table.messageType, table.userId, table.emoji),
  ]
);
