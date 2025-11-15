import { PrismaClient } from '../generated/prisma/client';
import { config } from 'dotenv';

// Carrega variáveis de ambiente
config();

const prisma = new PrismaClient();

async function testDatabase() {
  console.log('🔍 Testando conexão com o banco de dados...\n');

  // Verifica se DATABASE_URL está configurada
  let dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ Erro: DATABASE_URL não está configurada no arquivo .env');
    console.error('   Por favor, configure a variável DATABASE_URL no arquivo .env');
    console.error('   Exemplo para PostgreSQL: DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"');
    process.exit(1);
  }

  // Remove aspas se existirem
  dbUrl = dbUrl.replace(/^["']|["']$/g, '');
  
  // Atualiza a variável de ambiente
  process.env.DATABASE_URL = dbUrl;

  console.log(`📋 DATABASE_URL configurada: ${dbUrl.replace(/:[^:@]+@/, ':****@')}\n`);

  try {
    // Teste 1: Conectar ao banco
    console.log('1️⃣ Testando conexão...');
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!\n');

    // Teste 2: Verificar se consegue executar uma query simples
    console.log('2️⃣ Testando query simples...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query executada com sucesso!', result, '\n');

    // Teste 3: Verificar se a tabela User existe e contar registros
    console.log('3️⃣ Verificando tabela User...');
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Tabela User encontrada! Total de usuários: ${userCount}\n`);
    } catch (error: any) {
      if (error?.message?.includes('does not exist')) {
        console.log('⚠️  Tabela User não existe. Execute as migrações com: npx prisma migrate dev\n');
      } else {
        throw error;
      }
    }

    // Teste 4: Listar todas as tabelas (PostgreSQL)
    console.log('4️⃣ Listando tabelas do banco...');
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `;
    console.log('✅ Tabelas encontradas:');
    tables.forEach((table) => {
      console.log(`   - ${table.tablename}`);
    });
    console.log('');

    console.log('🎉 Todos os testes passaram! O banco de dados está funcionando corretamente.');
  } catch (error) {
    console.error('❌ Erro ao testar o banco de dados:');
    if (error instanceof Error) {
      console.error(`   Mensagem: ${error.message}`);
      console.error(`   Stack: ${error.stack}`);
    } else {
      console.error(error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexão encerrada.');
  }
}

testDatabase();

