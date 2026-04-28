import { eq, and, desc, count } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { notifications } from '../../db/schema/notifications.js';
import type { CreateNotificationInput } from './notifications.schema.js';

export class NotificationsService {
  constructor(private app: FastifyInstance) {}

  async getNotifications(userId: string, limit = 50, unreadOnly = false) {
    const conditions = [eq(notifications.userId, userId)];

    if (unreadOnly) {
      conditions.push(eq(notifications.read, false));
    }

    return this.app.db
      .select()
      .from(notifications)
      .where(and(...conditions))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }

  async getUnreadCount(userId: string) {
    const [result] = await this.app.db
      .select({ count: count() })
      .from(notifications)
      .where(
        and(eq(notifications.userId, userId), eq(notifications.read, false))
      );

    return result.count;
  }

  async markAsRead(notificationId: string, userId: string) {
    const [updated] = await this.app.db
      .update(notifications)
      .set({ read: true })
      .where(
        and(eq(notifications.id, notificationId), eq(notifications.userId, userId))
      )
      .returning();

    if (!updated) throw new Error('Notification not found');
    return updated;
  }

  async markAllAsRead(userId: string) {
    await this.app.db
      .update(notifications)
      .set({ read: true })
      .where(
        and(eq(notifications.userId, userId), eq(notifications.read, false))
      );
  }

  async create(input: CreateNotificationInput) {
    const [notification] = await this.app.db
      .insert(notifications)
      .values({
        userId: input.userId,
        type: input.type,
        data: input.data,
      })
      .returning();

    return notification;
  }
}
