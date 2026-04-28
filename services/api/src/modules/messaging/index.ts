import type { FastifyInstance } from 'fastify';
import { messagingRoutes } from './messaging.routes.js';

export async function messagingModule(app: FastifyInstance) {
  await messagingRoutes(app);
}
