import type { FastifyInstance } from 'fastify';
import { notificationsRoutes } from './notifications.routes.js';

export async function notificationsModule(app: FastifyInstance) {
  await notificationsRoutes(app);
}
