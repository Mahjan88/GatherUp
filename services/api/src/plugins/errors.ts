import fp from 'fastify-plugin';
import { ZodError } from 'zod';
import type { FastifyError, FastifyInstance } from 'fastify';

export const errorsPlugin = fp(async (app: FastifyInstance) => {
  // Routes validate input with schema.parse(), which throws a ZodError.
  // Report those (and malformed values Postgres rejects) as 400s; anything else keeps Fastify's default handling.
  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        // e.g. "keyword: Required; lat: Number must be less than or equal to 90"
        message: error.issues
          .map(
            (i) => (i.path.length ? `${i.path.join('.')}: ` : '') + i.message
          )
          .join('; '),
        issues: error.issues,
      });
    }
    // Postgres invalid_text_representation, e.g. a malformed uuid in a route
    // param that the route passed straight to a query
    if (error.code === '22P02') {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid id or value in request',
      });
    }
    if ((error.statusCode ?? 500) >= 500) request.log.error(error);
    return reply.send(error);
  });
});
