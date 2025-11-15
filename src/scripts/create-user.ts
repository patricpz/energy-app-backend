import { config } from 'dotenv';

config();

const API_URL = process.env.API_URL || 'http://localhost:3020';

async function createUser() {
  const userData = {
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'senha123',
  };

  console.log('📝 Criando usuário...\n');
  console.log('Dados:', { ...userData, password: '***' });
  console.log('');

  try {
    const response = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Usuário criado com sucesso!');
      console.log('Dados do usuário:', { ...data, password: '***' });
    } else {
      console.error('❌ Erro ao criar usuário:');
      console.error(data);
    }
  } catch (error: any) {
    console.error('❌ Erro na requisição:');
    console.error(error.message);
    console.error('\n💡 Certifique-se de que o servidor está rodando em', API_URL);
  }
}

createUser();

