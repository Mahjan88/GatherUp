import type { FastifyInstance } from 'fastify';
import { ticketmasterRoutes } from './ticketmaster.routes.js';

export async function ticketmasterModule(app: FastifyInstance) {
  await ticketmasterRoutes(app);
}
