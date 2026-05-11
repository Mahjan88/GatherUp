import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  reporterId: uuid('reporter_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  targetType: text('target_type', {
    enum: ['user', 'event', 'community', 'message', 'media'],
  }).notNull(),
  targetId: uuid('target_id').notNull(),
  reason: text('reason').notNull(),
  details: text('details'),
  status: text('status', {
    enum: ['open', 'reviewed', 'dismissed', 'action_taken'],
  })
    .notNull()
    .default('open'),
  reviewedBy: uuid('reviewed_by').references(() => users.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
});
