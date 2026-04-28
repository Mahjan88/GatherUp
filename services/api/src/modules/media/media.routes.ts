import type { FastifyInstance } from 'fastify';
import { MediaService } from './media.service.js';

export async function mediaRoutes(app: FastifyInstance) {
  const service = new MediaService(app);

  // All media routes require authentication
  app.addHook('preHandler', app.authenticate);

  // GET /api/media/event/:eventId
  app.get('/event/:eventId', async (request, reply) => {
    const { eventId } = request.params as { eventId: string };
    const media = await service.getEventMedia(eventId);
    return reply.send({ data: media });
  });

  // POST /api/media/event/:eventId/upload
  app.post('/event/:eventId/upload', async (request, reply) => {
    const { eventId } = request.params as { eventId: string };
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: 'No file uploaded' });
    }

    const buffer = await data.toBuffer();
    const record = await service.uploadEventMedia(
      eventId,
      request.userId!,
      buffer,
      data.filename,
      data.mimetype
    );

    return reply.status(201).send({ data: record });
  });

  // DELETE /api/media/:id
  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await service.deleteEventMedia(id, request.userId!);
    return reply.status(204).send();
  });

  // POST /api/media/avatar
  app.post('/avatar', async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: 'No file uploaded' });
    }

    const buffer = await data.toBuffer();
    const url = await service.uploadAvatar(request.userId!, buffer, data.mimetype);
    return reply.send({ data: { url } });
  });
}
