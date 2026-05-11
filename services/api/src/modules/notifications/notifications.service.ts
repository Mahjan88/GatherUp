import { eq, and, desc, count } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { notification } from '../../db/schema/notifications.js';
import type { CreateNotificationInput } from './notifications.schema.js';

export class NotificationsService {
  constructor(private app: FastifyInstance) {}

  async getNotifications(userId: string, limit = 50, unreadOnly = false) {
    const conditions = [eq(notification.userId, userId)];

    if (unreadOnly) {
      conditions.push(eq(notification.read, false));
    }

    return this.app.db
      .select()
      .from(notification)
      .where(and(...conditions))
      .orderBy(desc(notification.createdAt))
      .limit(limit);
  }

  async getUnreadCount(userId: string) {
    const [result] = await this.app.db
      .select({ count: count() })
      .from(notification)
      .where(
        and(eq(notification.userId, userId), eq(notification.read, false))
      );

    return result.count;
  }

  async markAsRead(notificationId: string, userId: string) {
    const [updated] = await this.app.db
      .update(notification)
      .set({ read: true })
      .where(
        and(eq(notification.id, notificationId), eq(notification.userId, userId))
      )
      .returning();

    if (!updated) throw new Error('Notification not found');
    return updated;
  }

  async markAllAsRead(userId: string) {
    await this.app.db
      .update(notification)
      .set({ read: true })
      .where(
        and(eq(notification.userId, userId), eq(notification.read, false))
      );
  }

  async create(input: CreateNotificationInput) {
    const [created] = await this.app.db
      .insert(notification)
      .values({
        userId: input.userId,
        type: input.type,
        data: input.data,
      })
      .returning();

    return created;
  }
}
