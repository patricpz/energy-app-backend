import type { FastifyInstance } from 'fastify';

import { healthRoutes } from './health.routes';

export const registerRoutes = (app: FastifyInstance) => {
  app.register(healthRoutes, { prefix: '/health' });
};

