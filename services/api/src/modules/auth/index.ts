import type { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes.js';

export async function authModule(app: FastifyInstance) {
  await authRoutes(app);
}
