import type { FastifyInstance } from 'fastify';
import { MessagingService } from './messaging.service.js';
import {
  sendEventMessageSchema,
  sendPrivateMessageSchema,
  messagesQuerySchema,
} from './messaging.schema.js';

export async function messagingRoutes(app: FastifyInstance) {
  const service = new MessagingService(app);

  // All messaging routes require authentication
  app.addHook('preHandler', app.authenticate);

  // --- Event Messages ---

  // GET /api/messages/event/:eventId
  app.get('/event/:eventId', async (request, reply) => {
    const { eventId } = request.params as { eventId: string };
    const query = messagesQuerySchema.parse(request.query);
    const messages = await service.getEventMessages(eventId, query.limit, query.before);
    return reply.send({ data: messages });
  });

  // POST /api/messages/event/:eventId
  app.post('/event/:eventId', async (request, reply) => {
    const { eventId } = request.params as { eventId: string };
    const body = sendEventMessageSchema.parse(request.body);
    const message = await service.sendEventMessage(eventId, request.userId!, body);
    return reply.status(201).send({ data: message });
  });

  // --- Private Messages ---

  // GET /api/messages/conversations — list conversation summaries
  app.get('/conversations', async (request, reply) => {
    const conversations = await service.getConversations(request.userId!);
    return reply.send({ data: conversations });
  });

  // GET /api/messages/dm/:userId — get messages with a specific user
  app.get('/dm/:userId', async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const query = messagesQuerySchema.parse(request.query);
    const messages = await service.getPrivateMessages(request.userId!, userId, query.limit, query.before);
    return reply.send({ data: messages });
  });

  // POST /api/messages/dm — send a private message
  app.post('/dm', async (request, reply) => {
    const body = sendPrivateMessageSchema.parse(request.body);
    const message = await service.sendPrivateMessage(request.userId!, body);
    return reply.status(201).send({ data: message });
  });

  // POST /api/messages/dm/:userId/read — mark messages as read
  app.post('/dm/:userId/read', async (request, reply) => {
    const { userId } = request.params as { userId: string };
    await service.markAsRead(request.userId!, userId);
    return reply.status(204).send();
  });
}
