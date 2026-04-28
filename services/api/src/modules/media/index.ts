import type { FastifyInstance } from 'fastify';
import multipart from '@fastify/multipart';
import { mediaRoutes } from './media.routes.js';

export async function mediaModule(app: FastifyInstance) {
  // Register multipart support for file uploads
  await app.register(multipart, {
    limits: {
      fileSize: 52428800, // 50MB
    },
  });

  await mediaRoutes(app);
}
