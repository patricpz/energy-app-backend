import 'fastify';

type AppEnv = typeof import('../config/env')['env'];

declare module 'fastify' {
  interface FastifyInstance {
    config: AppEnv;
  }
}

