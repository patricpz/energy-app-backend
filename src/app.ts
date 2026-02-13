import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import authPlugin from './plugins/authPlugin';

import { env } from './config/env';
import { registerRoutes } from './routes';

export const buildApp = async () => {
  const app = Fastify({
    logger: true,
  });

  app.decorate('config', env);

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Energy App Backend API',
        description: 'Documentação das rotas do backend Energy App',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${env.PORT ?? 3020}`,
          description: 'Servidor local',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await app.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
  });

  // Isso habilita a tecnologia de "tempo real" no servidor
  app.register(websocket);

  app.register(authPlugin);

  // O App vai conectar em: ws://localhost:3020/ws
  app.register(async function (fastify) {
    fastify.get('/ws', {
      websocket: true,
      schema: {
        tags: ['WebSocket'],
        summary: 'Endpoint websocket para conexões em tempo real',
      },
    }, (connection: any, req) => {
      console.log('App conectado no WebSocket!');

      connection.socket.on('close', () => {
        console.log('App desconectou.');
      });
    });
  });

  // Rota simples para teste no navegador
  app.get('/', {
    schema: {
      tags: ['System'],
      summary: 'Verificar se a API está ativa',
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  }, () => {
    return { message: 'hello' };
  });

  await registerRoutes(app);

  return app;
};
