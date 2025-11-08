import Fastify from 'fastify';

import { env } from './config/env';
import { logger } from './config/logger';
import { registerRoutes } from './routes';

export const buildApp = () => {
  const app = Fastify({
    logger: true
  });

  app.decorate('config', env);

  registerRoutes(app);

  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, 'Erro interno no servidor');
    reply.status(error.statusCode ?? 500).send({
      message: 'Erro interno do servidor'
    });
  });

  return app;
};

export type AppInstance = ReturnType<typeof buildApp>;

