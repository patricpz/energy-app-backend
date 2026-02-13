import { FastifyInstance } from 'fastify';

import { userController } from '../controllers/userController';
import { energyController } from '../controllers/energyController';

import { domesticEquipamentController } from '../controllers/domesticEquipamentController';

const authenticatedRoute = {
  security: [{ bearerAuth: [] }],
};

const userIdParams = {
  type: 'object',
  properties: {
    userId: { type: 'integer' },
  },
  required: ['userId'],
};

const userByIdParams = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
  },
  required: ['id'],
};

const domesticEquipamentParams = {
  type: 'object',
  properties: {
    userId: { type: 'integer' },
    id: { type: 'integer' },
  },
  required: ['userId', 'id'],
};

const energyYearParams = {
  type: 'object',
  properties: {
    userId: { type: 'integer' },
    year: { type: 'integer' },
  },
  required: ['userId', 'year'],
};

const energyMonthParams = {
  type: 'object',
  properties: {
    userId: { type: 'integer' },
    year: { type: 'integer' },
    month: { type: 'integer' },
  },
  required: ['userId', 'year', 'month'],
};

const energyDayParams = {
  type: 'object',
  properties: {
    userId: { type: 'integer' },
    year: { type: 'integer' },
    month: { type: 'integer' },
    day: { type: 'integer' },
  },
  required: ['userId', 'year', 'month', 'day'],
};

const createUserSchema = {
  schema: {
    tags: ['Users'],
    summary: 'Criar usuário',
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
    tags: ['Users'],
    summary: 'Autenticar usuário',
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
    tags: ['DomesticEquipaments'],
    summary: 'Criar equipamento doméstico',
    body: {
      type: 'object',
      required: ['name', 'consumeKwh'],
      properties: {
        name: { type: 'string' },
        consumeKwh: { type: 'number' },
      },
    }
  }
}

export default async function userRoutes(app: FastifyInstance) {
  app.post('/users', { ...createUserSchema }, userController.create);
  app.get('/users', {
    preHandler: [app.authenticate],
    schema: {
      tags: ['Users'],
      summary: 'Listar usuários',
      ...authenticatedRoute,
    },
  }, userController.list);
  app.get('/users/:id', {
    preHandler: [app.authenticate],
    schema: {
      tags: ['Users'],
      summary: 'Buscar usuário por ID',
      params: userByIdParams,
      ...authenticatedRoute,
    },
  }, userController.findById);
  app.put('/users/:id', {
    preHandler: [app.authenticate],
    schema: {
      tags: ['Users'],
      summary: 'Atualizar usuário por ID',
      params: userByIdParams,
      ...authenticatedRoute,
    },
  }, userController.update);
  app.delete('/users/:id', {
    preHandler: [app.authenticate],
    schema: {
      tags: ['Users'],
      summary: 'Deletar usuário por ID',
      params: userByIdParams,
      ...authenticatedRoute,
    },
  }, userController.delete);
  app.post('/users/login', { ...loginUserSchema }, userController.login);

  app.get('/users/:userId/energyYears/:year/energyMonths/:month/energyDays/:day/energyHours', {
    preHandler: [app.authenticate],
    schema: {
      tags: ['Energy'],
      summary: 'Listar horas de consumo do dia',
      params: energyDayParams,
      ...authenticatedRoute,
    },
  }, energyController.listHours);
  app.get('/users/:userId/energyYears/:year/energyMonths/:month/energyDays', {
    preHandler: [app.authenticate],
    schema: {
      tags: ['Energy'],
      summary: 'Listar dias de consumo do mês',
      params: energyMonthParams,
      ...authenticatedRoute,
    },
  }, energyController.listDays);
  app.get('/users/:userId/energyYears/:year/energyMonths', {
    preHandler: [app.authenticate],
    schema: {
      tags: ['Energy'],
      summary: 'Listar meses de consumo do ano',
      params: energyYearParams,
      ...authenticatedRoute,
    },
  }, energyController.listMonths);
  app.get('/users/:userId/energyYears', {
    preHandler: [app.authenticate],
    schema: {
      tags: ['Energy'],
      summary: 'Listar anos de consumo do usuário',
      params: userIdParams,
      ...authenticatedRoute,
    },
  }, energyController.listYears);

  app.get('/users/:userId/today', {
    preHandler: [app.authenticate],
    schema: {
      tags: ['Energy'],
      summary: 'Relatório de consumo do dia atual',
      params: userIdParams,
      ...authenticatedRoute,
    },
  }, energyController.relatoryToday)

  app.post('/users/:userId/domesticEquipaments', {
    preHandler: [app.authenticate],
    ...domesticEquipamentSchema,
    schema: {
      ...domesticEquipamentSchema.schema,
      params: userIdParams,
      ...authenticatedRoute,
    },
  }, domesticEquipamentController.createEquipament);
  app.get('/users/:userId/domesticEquipaments', {
    preHandler: [app.authenticate],
    schema: {
      tags: ['DomesticEquipaments'],
      summary: 'Listar equipamentos domésticos do usuário',
      params: userIdParams,
      ...authenticatedRoute,
    },
  }, domesticEquipamentController.listEquipaments);
  app.get('/users/:userId/domesticEquipaments/:id', {
    preHandler: [app.authenticate],
    schema: {
      tags: ['DomesticEquipaments'],
      summary: 'Buscar equipamento doméstico por ID',
      params: domesticEquipamentParams,
      ...authenticatedRoute,
    },
  }, domesticEquipamentController.findEquipament)
  app.put('/users/:userId/domesticEquipaments/:id', {
    preHandler: [app.authenticate],
    schema: {
      tags: ['DomesticEquipaments'],
      summary: 'Atualizar equipamento doméstico por ID',
      params: domesticEquipamentParams,
      ...authenticatedRoute,
    },
  }, domesticEquipamentController.updateEquipament);
  app.delete('/users/:userId/domesticEquipaments/:id', {
    preHandler: [app.authenticate],
    schema: {
      tags: ['DomesticEquipaments'],
      summary: 'Deletar equipamento doméstico por ID',
      params: domesticEquipamentParams,
      ...authenticatedRoute,
    },
  }, domesticEquipamentController.deleteEquipament);

  app.get('/energyDistributors', {
    schema: {
      tags: ['Energy'],
      summary: 'Listar distribuidoras de energia',
    },
  }, energyController.listEnergyDistributor);
}
