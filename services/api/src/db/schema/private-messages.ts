import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
} from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const privateMessage = pgTable('private_message', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('sender_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  recipientId: uuid('recipient_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  messageType: text('message_type', {
    enum: ['text', 'image', 'video', 'file', 'voice'],
  })
    .notNull()
    .default('text'),
  content: text('content'),
  attachments: jsonb('attachments'),
  replyToMessageId: uuid('reply_to_message_id'),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  editedAt: timestamp('edited_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
