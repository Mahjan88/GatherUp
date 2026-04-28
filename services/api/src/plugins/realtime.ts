import fp from 'fastify-plugin';
import websocket from '@fastify/websocket';
import type { FastifyInstance } from 'fastify';

export const realtimePlugin = fp(async (app: FastifyInstance) => {
  await app.register(websocket, {
    options: {
      maxPayload: 1048576, // 1MB
    },
  });

  // WebSocket endpoint for real-time subscriptions
  app.get('/ws', { websocket: true }, (socket, request) => {
    const userId = request.userId;

    if (!userId) {
      socket.close(4001, 'Unauthorized');
      return;
    }

    app.log.info(`WebSocket connected: user ${userId}`);

    socket.on('message', (rawMessage) => {
      try {
        const message = JSON.parse(rawMessage.toString());

        // Handle subscription messages
        switch (message.type) {
          case 'subscribe:event_messages':
            // Client wants to subscribe to event chat messages
            app.log.info(`User ${userId} subscribing to event ${message.eventId} messages`);
            break;

          case 'subscribe:private_messages':
            // Client wants to subscribe to their private messages
            app.log.info(`User ${userId} subscribing to private messages`);
            break;

          case 'subscribe:notifications':
            // Client wants to subscribe to their notifications
            app.log.info(`User ${userId} subscribing to notifications`);
            break;

          case 'ping':
            socket.send(JSON.stringify({ type: 'pong' }));
            break;

          default:
            app.log.warn(`Unknown message type: ${message.type}`);
        }
      } catch {
        app.log.error('Failed to parse WebSocket message');
      }
    });

    socket.on('close', () => {
      app.log.info(`WebSocket disconnected: user ${userId}`);
    });
  });
});
