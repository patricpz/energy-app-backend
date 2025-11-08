import type { FastifyInstance } from 'fastify';

import { healthController } from '../controllers/health.controller';

export const healthRoutes = async (app: FastifyInstance) => {
  app.get('/', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  }, async () => healthController.getStatus());
};

