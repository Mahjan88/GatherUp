import { pgTable, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const blockedUsers = pgTable(
  'blocked_users',
  {
    blockerId: uuid('blocker_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    blockedUserId: uuid('blocked_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.blockerId, table.blockedUserId] }),
  ]
);
