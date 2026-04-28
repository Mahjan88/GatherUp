import Fastify from 'fastify';
import { loadEnv } from './config/env.js';
import { createDatabase, closeDatabase } from './config/database.js';
import { corsPlugin } from './plugins/cors.js';
import { authPlugin } from './plugins/auth.js';
import { eventsModule } from './modules/events/index.js';
import { messagingModule } from './modules/messaging/index.js';
import { authModule } from './modules/auth/index.js';
import { mediaModule } from './modules/media/index.js';
import { notificationsModule } from './modules/notifications/index.js';
import { realtimePlugin } from './plugins/realtime.js';

async function main() {
  const env = loadEnv();

  // Initialize database
  const db = createDatabase(env.DATABASE_URL);

  // Create Fastify instance
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'production' ? 'info' : 'debug',
      transport:
        env.NODE_ENV === 'development'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
  });

  // Decorate with env and db for access in routes
  app.decorate('env', env);
  app.decorate('db', db);

  // Register plugins
  await app.register(corsPlugin);
  await app.register(authPlugin);
  await app.register(realtimePlugin);

  // Register domain modules (each is a Fastify plugin with its own routes)
  await app.register(authModule, { prefix: '/api/auth' });
  await app.register(eventsModule, { prefix: '/api/events' });
  await app.register(messagingModule, { prefix: '/api/messages' });
  await app.register(mediaModule, { prefix: '/api/media' });
  await app.register(notificationsModule, { prefix: '/api/notifications' });

  // Health check
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  }));

  // Graceful shutdown
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  for (const signal of signals) {
    process.on(signal, async () => {
      app.log.info(`Received ${signal}, shutting down...`);
      await app.close();
      await closeDatabase();
      process.exit(0);
    });
  }

  // Start server
  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`Server running at http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
