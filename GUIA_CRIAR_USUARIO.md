# Guia: Como Criar um Usuário

## Passo a Passo

### 1. Iniciar o Servidor

Primeiro, certifique-se de que o servidor está rodando:

```bash
npm run dev
```

O servidor estará disponível em: `http://localhost:3020`

### 2. Criar um Usuário

Você tem 3 opções para criar um usuário:

#### Opção A: Usando o Script Automatizado

```bash
npm run create:user
```

Este script criará um usuário de exemplo com:
- Nome: João Silva
- Email: joao@example.com
- Senha: senha123

#### Opção B: Usando cURL

```bash
curl -X POST http://localhost:3020/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria@example.com",
    "password": "senha456"
  }'
```

#### Opção C: Usando uma Ferramenta de API (Postman, Insomnia, etc.)

**URL:** `POST http://localhost:3020/api/users`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Pedro Oliveira",
  "email": "pedro@example.com",
  "password": "senha789"
}
```

### 3. Validações

A API valida:
- ✅ `name`: obrigatório, string não vazia
- ✅ `email`: obrigatório, formato de email válido
- ✅ `password`: obrigatório, mínimo de 6 caracteres
- ✅ Email único (não pode haver dois usuários com o mesmo email)

### 4. Respostas da API

**Sucesso (201 Created):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "$2b$10$...",
  "createdAt": "2024-11-14T21:14:00.000Z"
}
```

**Erro - Email já existe (400 Bad Request):**
```json
{
  "error": "Email already registered"
}
```

**Erro - Validação (400 Bad Request):**
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "body must have required property 'email'"
}
```

### 5. Listar Usuários

Para ver todos os usuários criados:

```bash
curl http://localhost:3020/api/users
```

Ou acesse no navegador: `http://localhost:3020/api/users`

## Estrutura da API

- **POST** `/api/users` - Criar usuário
- **GET** `/api/users` - Listar todos os usuários

## Notas Importantes

⚠️ A senha é automaticamente criptografada usando bcrypt antes de ser salva no banco de dados.

⚠️ A senha nunca é retornada nas respostas da API por questões de segurança.

