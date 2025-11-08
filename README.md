# Fastify MVC Template

Template de backend **Fastify + Node.js + TypeScript** com arquitetura MVC, pronto para uso em produção.

## Requisitos

- Node.js 18 ou superior
- npm (ou pnpm/yarn, ajuste os comandos conforme necessário)

## Instalação

```bash
npm install
```

## Scripts

- `npm run dev` – inicia a aplicação em modo desenvolvimento com recarga automática.
- `npm run build` – transpila o projeto para JavaScript em `dist`.
- `npm run start` – executa o código transpilado em produção.
- `npm run lint` – roda o ESLint.
- `npm run lint:fix` – corrige automaticamente problemas encontrados pelo ESLint.
- `npm run format` – formata o código com Prettier.

## Estrutura de Pastas

```text
src/
├── app.ts               # Construção da instância do Fastify e registro de middlewares/rotas
├── server.ts            # Ponto de entrada da aplicação
├── config/              # Configurações (env, logger, etc.)
├── controllers/         # Camada de controladores (MVC)
├── repositories/        # Camada de acesso a dados
├── routes/              # Definição de rotas e schemas
├── services/            # Regras de negócio
└── types/               # Tipos e augmentations
```

## Variáveis de Ambiente

Copie `env.example` para `.env` e ajuste conforme necessário:

```bash
cp env.example .env
```

## Qualidade de Código

- ESLint configurado com `@typescript-eslint` e `prettier`
- Prettier para formatação consistente

## Deploy

1. Transpile a aplicação: `npm run build`
2. Rode o artefato gerado: `npm run start`

## Licença

MIT

# energy-app-backend
