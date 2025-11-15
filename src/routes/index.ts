import type { FastifyInstance } from 'fastify';

import { healthRoutes } from './health.routes';
import userRoutes from './useRoutes';

export const registerRoutes = async (app: FastifyInstance) => {
  await app.register(healthRoutes, { prefix: '/health' });
  await app.register(userRoutes, { prefix: '/api' });
};
