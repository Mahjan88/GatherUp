import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { events } from './events.js';
import { users } from './users.js';

export const eventInvitations = pgTable('event_invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  invitedUserId: uuid('invited_user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
  invitedEmail: text('invited_email'),
  invitedPhone: text('invited_phone'),
  invitedBy: uuid('invited_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: text('status', {
    enum: ['sent', 'accepted', 'declined', 'expired', 'cancelled'],
  })
    .notNull()
    .default('sent'),
  token: text('token').unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
