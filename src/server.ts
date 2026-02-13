import { buildApp } from './app';
import mqttPlugin from "./plugins/mqttClient";

const start = async () => {
  try {
    const app = await buildApp();
    app.register(mqttPlugin);
    
    const port = Number(process.env.PORT) || 3020;
    const host = '0.0.0.0';
    await app.listen({ port, host });
    const docsHost = host === '0.0.0.0' ? 'localhost' : host;
    
    console.log(`🚀 Servidor rodando em http://${host}:${port}`);
    console.log(`📘 Swagger disponível em http://${docsHost}:${port}/docs`);
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

void start();
