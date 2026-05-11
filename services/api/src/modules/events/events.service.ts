import { eq, and, desc, gte, lte, sql, count } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { events } from '../../db/schema/events.js';
import { eventMembers } from '../../db/schema/event-members.js';
import { users } from '../../db/schema/users.js';
import type { CreateEventInput, UpdateEventInput, GetEventsQuery } from './events.schema.js';

export class EventsService {
  constructor(private app: FastifyInstance) {}

  async create(hostId: string, input: CreateEventInput) {
    const [created] = await this.app.db
      .insert(events)
      .values({
        ...input,
        hostId,
        startTime: new Date(input.startTime),
        endTime: input.endTime ? new Date(input.endTime) : null,
      })
      .returning();

    return created;
  }

  async getById(eventId: string) {
    const result = await this.app.db.query.events.findFirst({
      where: eq(events.id, eventId),
    });

    if (!result) throw new Error('Event not found');

    // Get host info
    const host = await this.app.db.query.users.findFirst({
      where: eq(users.id, result.hostId),
    });

    // Get member count
    const [memberCount] = await this.app.db
      .select({ count: count() })
      .from(eventMembers)
      .where(and(eq(eventMembers.eventId, eventId), eq(eventMembers.status, 'joined')));

    return { ...result, host, memberCount: memberCount.count };
  }

  async list(query: GetEventsQuery) {
    const conditions = [];

    if (query.visibility) {
      conditions.push(eq(events.visibility, query.visibility));
    }
    if (query.startDate) {
      conditions.push(gte(events.startTime, new Date(query.startDate)));
    }
    if (query.endDate) {
      conditions.push(lte(events.startTime, new Date(query.endDate)));
    }
    if (query.category) {
      conditions.push(eq(events.category, query.category));
    }
    if (query.status) {
      conditions.push(eq(events.status, query.status));
    }
    if (query.communityId) {
      conditions.push(eq(events.communityId, query.communityId));
    }

    const offset = (query.page - 1) * query.limit;

    const results = await this.app.db
      .select()
      .from(events)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(events.startTime))
      .limit(query.limit)
      .offset(offset);

    const [total] = await this.app.db
      .select({ count: count() })
      .from(events)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return { events: results, total: total.count, page: query.page, limit: query.limit };
  }

  async update(eventId: string, hostId: string, input: UpdateEventInput) {
    // Verify ownership
    const existing = await this.app.db.query.events.findFirst({
      where: and(eq(events.id, eventId), eq(events.hostId, hostId)),
    });

    if (!existing) throw new Error('Event not found or not authorized');

    const updateData: Record<string, unknown> = { ...input };
    if (input.startTime) updateData.startTime = new Date(input.startTime);
    if (input.endTime) updateData.endTime = new Date(input.endTime);

    const [updated] = await this.app.db
      .update(events)
      .set(updateData)
      .where(eq(events.id, eventId))
      .returning();

    return updated;
  }

  async delete(eventId: string, hostId: string) {
    const existing = await this.app.db.query.events.findFirst({
      where: and(eq(events.id, eventId), eq(events.hostId, hostId)),
    });

    if (!existing) throw new Error('Event not found or not authorized');

    await this.app.db.delete(events).where(eq(events.id, eventId));
  }

  async getHostedEvents(hostId: string) {
    return this.app.db
      .select()
      .from(events)
      .where(eq(events.hostId, hostId))
      .orderBy(desc(events.startTime));
  }

  async getJoinedEvents(userId: string) {
    const results = await this.app.db
      .select({ events })
      .from(eventMembers)
      .innerJoin(events, eq(eventMembers.eventId, events.id))
      .where(
        and(
          eq(eventMembers.userId, userId),
          eq(eventMembers.status, 'joined')
        )
      )
      .orderBy(desc(events.startTime));

    return results.map((r) => r.events);
  }

  // --- Member management ---

  async invite(eventId: string, userId: string) {
    const [member] = await this.app.db
      .insert(eventMembers)
      .values({
        eventId,
        userId,
        status: 'invited',
        role: 'member',
      })
      .returning();

    return member;
  }

  async respondToInvitation(eventId: string, userId: string, status: 'joined' | 'declined') {
    const [updated] = await this.app.db
      .update(eventMembers)
      .set({ status })
      .where(
        and(eq(eventMembers.eventId, eventId), eq(eventMembers.userId, userId))
      )
      .returning();

    if (!updated) throw new Error('Invitation not found');
    return updated;
  }

  async requestToJoin(eventId: string, userId: string) {
    const [member] = await this.app.db
      .insert(eventMembers)
      .values({
        eventId,
        userId,
        status: 'pending',
        role: 'member',
      })
      .returning();

    return member;
  }

  async approveJoinRequest(eventId: string, userId: string) {
    const [updated] = await this.app.db
      .update(eventMembers)
      .set({ status: 'joined' })
      .where(
        and(eq(eventMembers.eventId, eventId), eq(eventMembers.userId, userId))
      )
      .returning();

    if (!updated) throw new Error('Join request not found');
    return updated;
  }

  async declineJoinRequest(eventId: string, userId: string) {
    const [updated] = await this.app.db
      .update(eventMembers)
      .set({ status: 'declined' })
      .where(
        and(eq(eventMembers.eventId, eventId), eq(eventMembers.userId, userId))
      )
      .returning();

    if (!updated) throw new Error('Join request not found');
    return updated;
  }
}
