import fp from 'fastify-plugin';
import jwt, { type TokenOrHeader } from '@fastify/jwt';
import { createPublicKey, type JsonWebKey } from 'node:crypto';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export const authPlugin = fp(async (app: FastifyInstance) => {
  // Supabase signs user tokens with an asymmetric key (ES256/RS256) published
  // at its JWKS endpoint; older projects sign with the shared HS256 secret.
  const jwksUrl = new URL(
    '/auth/v1/.well-known/jwks.json',
    app.env.SUPABASE_URL
  );
  let publicKeys = new Map<string, string>();

  async function loadPublicKeys() {
    const response = await fetch(jwksUrl);
    if (!response.ok)
      throw new Error(`JWKS request failed: ${response.status}`);
    const { keys } = (await response.json()) as {
      keys: (JsonWebKey & { kid: string })[];
    };
    publicKeys = new Map(
      keys.map((jwk) => [
        jwk.kid,
        createPublicKey({ key: jwk, format: 'jwk' })
          .export({ type: 'spki', format: 'pem' })
          .toString(),
      ])
    );
  }

  // Register JWT, picking the verification key from each token's header
  await app.register(jwt, {
    secret: async (_request: FastifyRequest, token: TokenOrHeader) => {
      const { alg, kid } = 'header' in token ? token.header : token;
      if (alg === 'HS256') return app.env.JWT_SECRET;
      if (!kid) throw new Error('Token has no key id');
      // Refetch once for keys rotated in after startup
      if (!publicKeys.has(kid)) await loadPublicKeys();
      const key = publicKeys.get(kid);
      if (!key) throw new Error('Unknown signing key');
      return key;
    },
    // Pass the token header (alg, kid) to the secret callback above
    decode: { complete: true },
    verify: { algorithms: ['HS256', 'ES256', 'RS256'] },
  });

  // Decorate request with authentication method
  app.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const decoded = await request.jwtVerify<{ sub: string }>();
        request.userId = decoded.sub;
      } catch {
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
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}
