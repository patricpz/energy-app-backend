import { PrismaClient } from '../generated/prisma/client'; // Confirme se o caminho está certo no seu projeto
const prisma = new PrismaClient();

export const deviceDetectionService = {
  detectActiveDevices: async (userId: number, currentHousePowerWatts: number) => {
    
    // 1. Busca todos os aparelhos do usuário (que não foram deletados)
    // Ordenamos por 'power' decrescente (do maior para o menor) para a Lógica Gulosa
    const devices = await prisma.domesticEquipament.findMany({
      where: { 
          userId,
          // Se você usa soft delete no campo 'active', descomente abaixo:
          // active: true 
      },
      orderBy: { power: 'desc' } 
    });

    let remainingPower = currentHousePowerWatts;
    const updates = [];

    // 2. Loop para ver quem cabe no consumo atual
    for (const device of devices) {
      
      // Só consideramos aparelhos que têm potência cadastrada (> 0)
      if (remainingPower >= device.power && device.power > 0) {
        
        // Se cabe, liga a bolinha verde
        updates.push(prisma.domesticEquipament.update({
          where: { id: device.id },
          data: { isTurnedOn: true } 
        }));
        
        // Subtrai do total e continua para o próximo
        remainingPower -= device.power;
        
      } else {
        
        // Se não cabe, desliga a bolinha (cinza)
        updates.push(prisma.domesticEquipament.update({
          where: { id: device.id },
          data: { isTurnedOn: false }
        }));
        
      }
    }

    // 3. Executa todas as atualizações no banco de uma vez só (Performance)
    if (updates.length > 0) {
        await prisma.$transaction(updates);
    }
    
    return { message: "Status dos dispositivos atualizado!" };
  }
};