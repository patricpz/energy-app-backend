import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

const isTest = process.env.NODE_ENV === 'test';

if (!isTest) {
  loadEnv();
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info')
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Erro ao validar variáveis de ambiente:', parsedEnv.error.flatten().fieldErrors);
  throw new Error('Configuração de ambiente inválida. Verifique o arquivo .env');
}

export const env = parsedEnv.data;

