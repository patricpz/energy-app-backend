import { domesticEquipamentRepository } from "../repositories/domesticEquipamentRepository";

export const domesticEquipamentService = {
    createEquipament: async (userId: number, name: string, consumeKwh: number, model?: string) => {
        return await domesticEquipamentRepository.create(
            userId,
            name,
            consumeKwh,
            model
        )
    },

    listEquipament: async (userId: number) => {
        return await domesticEquipamentRepository.findAllByUser(userId);
    },

    findEquipament: async (id: number) => {
        return await domesticEquipamentRepository.findById(id);
    }
}