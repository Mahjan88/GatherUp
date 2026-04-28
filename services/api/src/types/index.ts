import type { FastifyInstance } from 'fastify';
import type { Env } from '../config/env.js';
import type { createDatabase } from '../config/database.js';

// Extend Fastify's type system with our custom decorations
declare module 'fastify' {
  interface FastifyInstance {
    env: Env;
    db: ReturnType<typeof createDatabase>;
  }

  interface FastifyRequest {
    userId?: string;
  }
}

// Standard API response types
export interface ApiResponse<T = unknown> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}
