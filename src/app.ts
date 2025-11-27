import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import authPlugin from './plugins/authPlugin';

import { env } from './config/env';
import { registerRoutes } from './routes';

export const buildApp = async () => {
  const app = Fastify({
    logger: true,
  });

  app.decorate('config', env);

  // Isso habilita a tecnologia de "tempo real" no servidor
  app.register(websocket);

  app.register(authPlugin);

  // O App vai conectar em: ws://localhost:3020/ws
  app.register(async function (fastify) {
    fastify.get('/ws', { websocket: true }, (connection: any, req) => {
      console.log('App conectado no WebSocket!');

      connection.socket.on('close', () => {
        console.log('App desconectou.');
      });
    });
  });

  // Rota simples para teste no navegador
  app.get('/', () => {
    return { message: 'hello' };
  });

  await registerRoutes(app);

  return app;
};
