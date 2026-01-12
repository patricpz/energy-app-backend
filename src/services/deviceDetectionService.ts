import { PrismaClient } from '../generated/prisma/client';
const prisma = new PrismaClient();

export const deviceDetectionService = {
  detectActiveDevices: async (userId: number, currentHousePowerWatts: number) => {
    
    const devices = await prisma.domesticEquipament.findMany({
      where: { 
          userId,
      },
      orderBy: { power: 'desc' } 
    });

    let remainingPower = currentHousePowerWatts;
    const updates = [];

    for (const device of devices) {
      
      if (remainingPower >= device.power && device.power > 0) {
        
        updates.push(prisma.domesticEquipament.update({
          where: { id: device.id },
          data: { isTurnedOn: true } 
        }));
        
        remainingPower -= device.power;
        
      } else {
        
        updates.push(prisma.domesticEquipament.update({
          where: { id: device.id },
          data: { isTurnedOn: false }
        }));
        
      }
    }

    if (updates.length > 0) {
        await prisma.$transaction(updates);
    }
    
    return { message: "Status dos dispositivos atualizado!" };
  }
};