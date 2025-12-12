import { FastifyInstance } from 'fastify';

import { userController } from '../controllers/userController';
import { energyController } from '../controllers/energyController';

import { domesticEquipamentController } from '../controllers/domesticEquipamentController';

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

const loginUserSchema = {
  schema: {
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
      },
    },
  },
};

const domesticEquipamentSchema = {
  schema: {
    body: {
      type: 'object',
      required: ['name', 'consumeKwh'],
    }
  }
}

export default async function userRoutes(app: FastifyInstance) {
  app.post('/users', { ...createUserSchema }, userController.create);
  app.get('/users', { preHandler: [app.authenticate] }, userController.list);
  app.get('/users/:id', { preHandler: [app.authenticate] }, userController.findById);
  app.put('/users/:id', { preHandler: [app.authenticate] }, userController.update);
  app.delete('/users/:id', { preHandler: [app.authenticate] }, userController.delete);
  app.post('/users/login', { ...loginUserSchema }, userController.login);

  app.get('/users/:userId/energyHours', { preHandler: [app.authenticate] }, energyController.listHours);
  app.get('/users/:userId/energyDays', { preHandler: [app.authenticate] }, energyController.listDays);
  app.get('/users/:userId/energyMonths', { preHandler: [app.authenticate] }, energyController.listMonths);
  app.get('/users/:userId/energyYears', { preHandler: [app.authenticate] }, energyController.listYears);

  app.post('/users/:userId/domesticEquipaments', { preHandler: [app.authenticate], ...domesticEquipamentSchema}, domesticEquipamentController.createEquipament);
  app.get('/users/:userId/domesticEquipaments', { preHandler: [app.authenticate] }, domesticEquipamentController.listEquipaments);
  app.get('/users/:userId/domesticEquipaments/:id', { preHandler: [app.authenticate] }, domesticEquipamentController.findEquipament)
}
