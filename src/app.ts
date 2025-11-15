import Fastify from 'fastify';

import { env } from './config/env';
import { registerRoutes } from './routes';

export const buildApp = async () => {
  const app = Fastify({
    logger: true,
  });

  app.decorate('config', env);

  // Rota simples para teste no navegador
  app.get('/', () => {
    return { message: 'hello' };
  });

  await registerRoutes(app);

  return app;
};
