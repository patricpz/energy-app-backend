import { buildApp } from './app';

const start = async () => {
  try {
    const app = await buildApp();
    await app.listen({ port: 3020, host: 'localhost' });

    console.log('Servidor rodando em:  http://localhost:3020');
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

void start();
