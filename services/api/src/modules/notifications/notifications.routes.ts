import type { FastifyInstance } from 'fastify';
import { NotificationsService } from './notifications.service.js';
import { notificationsQuerySchema } from './notifications.schema.js';

export async function notificationsRoutes(app: FastifyInstance) {
  const service = new NotificationsService(app);

  // All notification routes require authentication
  app.addHook('preHandler', app.authenticate);

  // GET /api/notifications
  app.get('/', async (request, reply) => {
    const query = notificationsQuerySchema.parse(request.query);
    const notifications = await service.getNotifications(
      request.userId!,
      query.limit,
      query.unreadOnly
    );
    return reply.send({ data: notifications });
  });

  // GET /api/notifications/unread-count
  app.get('/unread-count', async (request, reply) => {
    const count = await service.getUnreadCount(request.userId!);
    return reply.send({ data: { count } });
  });

  // PATCH /api/notifications/:id/read
  app.patch('/:id/read', async (request, reply) => {
    const { id } = request.params as { id: string };
    const notification = await service.markAsRead(id, request.userId!);
    return reply.send({ data: notification });
  });

  // POST /api/notifications/read-all
  app.post('/read-all', async (request, reply) => {
    await service.markAllAsRead(request.userId!);
    return reply.status(204).send();
  });
}
