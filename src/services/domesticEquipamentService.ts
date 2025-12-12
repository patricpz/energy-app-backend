import { domesticEquipamentRepository } from "../repositories/domesticEquipamentRepository";

export const domesticEquipamentService = {
    createEquipament: async (
        userId: number, 
        loggerUserId: number,
        name: string, 
        consumeKwh: number, 
        model?: string
    ) => {
        if (userId !== loggerUserId) {
            throw Error("Unauthorized action");
        }

        return await domesticEquipamentRepository.create(
            userId,
            name,
            consumeKwh,
            model
        )
    },

    listEquipament: async (userId: number, loggerUserId: number) => {
        if (userId !== loggerUserId) {
            throw Error("Unauthorized action");
        }

        return await domesticEquipamentRepository.findAllByUser(userId);
    },

    findEquipament: async (id: number, userId: number, loggerUserId: number) => {
        const equipament = await domesticEquipamentRepository.findById(id, userId);
        if (!equipament) {
            throw Error("Equipament not found");
        }
        if (loggerUserId !== userId) {
            throw Error("Unauthorized action");
        }

        return equipament;
    },

    updateEquipament: async (
        id: number, 
        userId: number, 
        loggerUserId: number, 
        data: any
    ) => {
        if (userId !== loggerUserId) {
            throw Error("Unauthorized action");
        }

        return await domesticEquipamentRepository.update(id, userId, data);
    },

    deleteEquipament: async (id: number, userId: number, loggerUserId: number) => {
        if (userId !== loggerUserId) {
            throw Error("Unauthorized action");
        }

        return await domesticEquipamentRepository.delete(id, userId);
    }
}