import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export const authPlugin = fp(async (app: FastifyInstance) => {
  // Register JWT with Supabase's JWT secret
  await app.register(jwt, {
    secret: app.env.JWT_SECRET,
  });

  // Decorate request with authentication method
  app.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const decoded = await request.jwtVerify<{ sub: string }>();
        request.userId = decoded.sub;
      } catch (err) {
        reply.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid or expired token',
        });
      }
    }
  );
});

// Extend Fastify types
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
