import { pgTable, uuid, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { events } from './events.js';
import { users } from './users.js';

export const eventMembers = pgTable(
  'event_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: text('status', {
      enum: ['invited', 'pending', 'joined', 'declined', 'removed'],
    })
      .notNull()
      .default('invited'),
    role: text('role', { enum: ['host', 'cohost', 'member'] })
      .notNull()
      .default('member'),
    rsvpStatus: text('rsvp_status', { enum: ['none', 'interested', 'going'] })
      .notNull()
      .default('none'),
    invitedBy: uuid('invited_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    lastReadMessageId: uuid('last_read_message_id'),
    mutedUntil: timestamp('muted_until', { withTimezone: true }),
    rsvpAt: timestamp('rsvp_at', { withTimezone: true }),
    checkedInAt: timestamp('checked_in_at', { withTimezone: true }),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [unique().on(table.eventId, table.userId)]
);
