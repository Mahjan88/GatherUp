import { pgTable, uuid, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const notification = pgTable('notification', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  actorId: uuid('actor_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  type: text('type').notNull(),
  entityType: text('entity_type'),
  entityId: uuid('entity_id'),
  data: jsonb('data').notNull().default({}),
  read: boolean('read').default(false),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
