import {
  pgTable,
  uuid,
  timestamp,
  primaryKey,
  boolean,
} from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { communities } from './communities.js';

export const communityFollows = pgTable(
  'community_follows',
  {
    followerId: uuid('follower_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    communityId: uuid('community_id')
      .notNull()
      .references(() => communities.id, { onDelete: 'cascade' }),
    notify: boolean('notify').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.followerId, table.communityId] }),
  ]
);
