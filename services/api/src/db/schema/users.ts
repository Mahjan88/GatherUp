import { pgTable, uuid, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').unique(),
  phone: text('phone').unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name'),
  username: text('username').unique(),
  tagline: text('tagline'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  city: text('city'),
  state: text('state'),
  country: text('country'),
  isVerified: boolean('is_verified').notNull().default(false),
  userData: jsonb('user_data').notNull().default({}),
  privacySettings: jsonb('privacy_settings').notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true }),
});
