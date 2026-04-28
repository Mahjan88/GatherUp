import type { FastifyInstance } from 'fastify';
import { EventsService } from './events.service.js';
import {
  createEventSchema,
  updateEventSchema,
  getEventsQuerySchema,
  inviteSchema,
  respondInvitationSchema,
  memberActionSchema,
} from './events.schema.js';

export async function eventsRoutes(app: FastifyInstance) {
  const service = new EventsService(app);

  // GET /api/events
  app.get('/', async (request, reply) => {
    const query = getEventsQuerySchema.parse(request.query);
    const result = await service.list(query);
    return reply.send({ data: result.events, meta: { total: result.total, page: result.page, limit: result.limit } });
  });

  // POST /api/events
  app.post('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    const body = createEventSchema.parse(request.body);
    const event = await service.create(request.userId!, body);
    return reply.status(201).send({ data: event });
  });

  // GET /api/events/hosted — my hosted events
  app.get('/hosted', { preHandler: [app.authenticate] }, async (request, reply) => {
    const events = await service.getHostedEvents(request.userId!);
    return reply.send({ data: events });
  });

  // GET /api/events/joined — events I've joined
  app.get('/joined', { preHandler: [app.authenticate] }, async (request, reply) => {
    const events = await service.getJoinedEvents(request.userId!);
    return reply.send({ data: events });
  });

  // GET /api/events/:id
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const event = await service.getById(id);
    return reply.send({ data: event });
  });

  // PUT /api/events/:id
  app.put('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateEventSchema.parse(request.body);
    const event = await service.update(id, request.userId!, body);
    return reply.send({ data: event });
  });

  // DELETE /api/events/:id
  app.delete('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    await service.delete(id, request.userId!);
    return reply.status(204).send();
  });

  // --- Member management ---

  // POST /api/events/:id/invite
  app.post('/:id/invite', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { userId } = inviteSchema.parse(request.body);
    const member = await service.invite(id, userId);
    return reply.status(201).send({ data: member });
  });

  // POST /api/events/:id/respond
  app.post('/:id/respond', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = respondInvitationSchema.parse(request.body);
    const member = await service.respondToInvitation(id, request.userId!, status);
    return reply.send({ data: member });
  });

  // POST /api/events/:id/join
  app.post('/:id/join', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const member = await service.requestToJoin(id, request.userId!);
    return reply.status(201).send({ data: member });
  });

  // POST /api/events/:id/approve
  app.post('/:id/approve', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { userId } = memberActionSchema.parse(request.body);
    const member = await service.approveJoinRequest(id, userId);
    return reply.send({ data: member });
  });

  // POST /api/events/:id/decline
  app.post('/:id/decline', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { userId } = memberActionSchema.parse(request.body);
    const member = await service.declineJoinRequest(id, userId);
    return reply.send({ data: member });
  });
}
