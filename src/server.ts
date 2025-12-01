import { buildApp } from './app';
import mqttPlugin from "./plugins/mqttClient";

const start = async () => {
  try {
    const app = await buildApp();
    app.register(mqttPlugin);
    
    const port = Number(process.env.PORT) || 3020;
    const host = '0.0.0.0';
    await app.listen({ port, host });
    
    console.log(`🚀 Servidor rodando em http://${host}:${port}`);
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

void start();
