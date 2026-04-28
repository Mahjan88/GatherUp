import type { FastifyInstance } from 'fastify';
import { eventsRoutes } from './events.routes.js';

export async function eventsModule(app: FastifyInstance) {
  await eventsRoutes(app);
}
