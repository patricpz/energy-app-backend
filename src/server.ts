import { buildApp } from './app';
import { env } from './config/env';

const app = buildApp();

const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    app.log.info(`🚀 Servidor iniciado em http://0.0.0.0:${env.PORT}`);
  } catch (error) {
    app.log.error(error, 'Falha ao iniciar o servidor');
    process.exit(1);
  }
};

start();

