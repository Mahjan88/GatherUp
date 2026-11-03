import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { TicketmasterService } from './ticketmaster.service.js';
import {
  resolveTicketmasterUrlSchema,
  searchTicketmasterSchema,
  ticketmasterEventParamsSchema,
} from './ticketmaster.schema.js';

export async function ticketmasterRoutes(app: FastifyInstance) {
  const service = new TicketmasterService(app);

  const requireConfigured = async (
    _request: FastifyRequest,
    reply: FastifyReply
  ) => {
    if (!service.isConfigured) {
      return reply.status(503).send({
        statusCode: 503,
        error: 'Service Unavailable',
        message: 'Ticketmaster import is not configured',
      });
    }
  };
  const preHandler = [app.authenticate, requireConfigured];

  // GET /api/ticketmaster/events?keyword=&city=&lat=&lng=
  app.get('/events', { preHandler }, async (request, reply) => {
    const query = searchTicketmasterSchema.parse(request.query);
    const result = await service.search(query);
    return reply.send({
      data: result.events,
      meta: { total: result.total, page: result.page, limit: result.size },
    });
  });

  // GET /api/ticketmaster/resolve?url=&lat=&lng= — pasted event or artist link
  app.get('/resolve', { preHandler }, async (request, reply) => {
    const { url, ...near } = resolveTicketmasterUrlSchema.parse(request.query);
    return reply.send({ data: await service.resolveUrl(url, near) });
  });

  // POST /api/ticketmaster/events/:id/import — link before creating an event
  app.post('/events/:id/import', { preHandler }, async (request, reply) => {
    const { id } = ticketmasterEventParamsSchema.parse(request.params);
    return reply.send({ data: await service.importEvent(id) });
  });
}
