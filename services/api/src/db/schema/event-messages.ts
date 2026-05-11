import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { events } from './events.js';
import { users } from './users.js';

export const eventMessage = pgTable('event_message', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  messageType: text('message_type', {
    enum: ['text', 'image', 'video', 'file', 'voice', 'system'],
  })
    .notNull()
    .default('text'),
  content: text('content'),
  attachments: jsonb('attachments'),
  replyToMessageId: uuid('reply_to_message_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  editedAt: timestamp('edited_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
