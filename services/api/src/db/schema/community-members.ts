import { pgTable, uuid, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { communities } from './communities.js';
import { users } from './users.js';

export const communityMembers = pgTable(
  'community_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    communityId: uuid('community_id')
      .notNull()
      .references(() => communities.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: text('role', { enum: ['owner', 'admin', 'member'] })
      .notNull()
      .default('member'),
    status: text('status', {
      enum: ['active', 'pending', 'banned', 'left', 'removed'],
    })
      .notNull()
      .default('active'),
    invitedBy: uuid('invited_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [unique().on(table.communityId, table.userId)]
);
