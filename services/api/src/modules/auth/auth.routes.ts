import type { FastifyInstance } from 'fastify';
import { AuthService } from './auth.service.js';
import {
  signUpSchema,
  signInEmailSchema,
  signInPhoneSchema,
  updateProfileSchema,
  searchUsersSchema,
} from './auth.schema.js';

export async function authRoutes(app: FastifyInstance) {
  const service = new AuthService(app);

  // POST /api/auth/signup
  app.post('/signup', async (request, reply) => {
    const body = signUpSchema.parse(request.body);
    const result = await service.signUp(body);
    return reply.status(201).send({ data: result });
  });

  // POST /api/auth/signin/email
  app.post('/signin/email', async (request, reply) => {
    const body = signInEmailSchema.parse(request.body);
    const result = await service.signInWithEmail(body);
    return reply.send({ data: result });
  });

  // POST /api/auth/signin/phone
  app.post('/signin/phone', async (request, reply) => {
    const body = signInPhoneSchema.parse(request.body);
    const result = await service.signInWithPhone(body);
    return reply.send({ data: result });
  });

  // GET /api/auth/me — requires auth
  app.get('/me', { preHandler: [app.authenticate] }, async (request, reply) => {
    const profile = await service.getProfile(request.userId!);
    return reply.send({ data: profile });
  });

  // PATCH /api/auth/me — requires auth
  app.patch('/me', { preHandler: [app.authenticate] }, async (request, reply) => {
    const body = updateProfileSchema.parse(request.body);
    const updated = await service.updateProfile(request.userId!, body);
    return reply.send({ data: updated });
  });

  // GET /api/auth/profile/:userId
  app.get('/profile/:userId', async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const profile = await service.getProfile(userId);
    return reply.send({ data: profile });
  });

  // GET /api/auth/search?query=...
  app.get(
    '/search',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { query } = searchUsersSchema.parse(request.query);
      const results = await service.searchUsers(query);
      return reply.send({ data: results });
    }
  );
}
