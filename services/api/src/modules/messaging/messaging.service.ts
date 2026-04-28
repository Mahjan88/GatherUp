import { eq, and, or, desc, lt, count } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { eventMessages } from '../../db/schema/event-messages.js';
import { privateMessages } from '../../db/schema/private-messages.js';
import { users } from '../../db/schema/users.js';
import type { SendEventMessageInput, SendPrivateMessageInput } from './messaging.schema.js';

export class MessagingService {
  constructor(private app: FastifyInstance) {}

  // --- Event Messages ---

  async sendEventMessage(eventId: string, senderId: string, input: SendEventMessageInput) {
    const [message] = await this.app.db
      .insert(eventMessages)
      .values({
        eventId,
        senderId,
        content: input.content,
        attachments: input.attachments ?? null,
      })
      .returning();

    return message;
  }

  async getEventMessages(eventId: string, limit = 50, before?: string) {
    const conditions = [eq(eventMessages.eventId, eventId)];

    if (before) {
      conditions.push(lt(eventMessages.createdAt, new Date(before)));
    }

    const messages = await this.app.db
      .select({
        message: eventMessages,
        sender: users,
      })
      .from(eventMessages)
      .innerJoin(users, eq(eventMessages.senderId, users.id))
      .where(and(...conditions))
      .orderBy(desc(eventMessages.createdAt))
      .limit(limit);

    return messages.map((m) => ({
      ...m.message,
      sender: m.sender,
    }));
  }

  // --- Private Messages ---

  async sendPrivateMessage(senderId: string, input: SendPrivateMessageInput) {
    const [message] = await this.app.db
      .insert(privateMessages)
      .values({
        senderId,
        recipientId: input.recipientId,
        content: input.content,
      })
      .returning();

    return message;
  }

  async getPrivateMessages(userId: string, otherUserId: string, limit = 50, before?: string) {
    const conditions = [
      or(
        and(eq(privateMessages.senderId, userId), eq(privateMessages.recipientId, otherUserId)),
        and(eq(privateMessages.senderId, otherUserId), eq(privateMessages.recipientId, userId))
      ),
    ];

    if (before) {
      conditions.push(lt(privateMessages.createdAt, new Date(before)));
    }

    const messages = await this.app.db
      .select({
        message: privateMessages,
        sender: users,
      })
      .from(privateMessages)
      .innerJoin(users, eq(privateMessages.senderId, users.id))
      .where(and(...conditions))
      .orderBy(desc(privateMessages.createdAt))
      .limit(limit);

    return messages.map((m) => ({
      ...m.message,
      sender: m.sender,
    }));
  }

  async getConversations(userId: string) {
    // Get all private messages involving the user, ordered by most recent
    const allMessages = await this.app.db
      .select({
        message: privateMessages,
        sender: users,
      })
      .from(privateMessages)
      .innerJoin(users, eq(privateMessages.senderId, users.id))
      .where(
        or(
          eq(privateMessages.senderId, userId),
          eq(privateMessages.recipientId, userId)
        )
      )
      .orderBy(desc(privateMessages.createdAt));

    // Group by conversation partner and take the latest message
    const conversationMap = new Map<string, (typeof allMessages)[0]>();
    for (const msg of allMessages) {
      const otherUserId =
        msg.message.senderId === userId
          ? msg.message.recipientId
          : msg.message.senderId;

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, msg);
      }
    }

    // Enrich with the other user's profile
    const conversations = [];
    for (const [otherUserId, msg] of conversationMap) {
      const otherUser = await this.app.db.query.users.findFirst({
        where: eq(users.id, otherUserId),
      });

      conversations.push({
        ...msg.message,
        sender: msg.sender,
        otherUser,
      });
    }

    return conversations;
  }

  async markAsRead(userId: string, otherUserId: string) {
    await this.app.db
      .update(privateMessages)
      .set({ read: true })
      .where(
        and(
          eq(privateMessages.senderId, otherUserId),
          eq(privateMessages.recipientId, userId),
          eq(privateMessages.read, false)
        )
      );
  }
}
