import { FastifyInstance } from 'fastify';

import { userController } from '../controllers/userController';

const createUserSchema = {
  schema: {
    body: {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
      },
    },
  },
};

export default async function userRoutes(app: FastifyInstance) {
  app.post('/users', { ...createUserSchema }, userController.create);
  app.get('/users', userController.list);
}
