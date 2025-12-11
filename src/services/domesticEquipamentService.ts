import { domesticEquipamentRepository } from "../repositories/domesticEquipamentRepository";

export const domesticEquipamentService = {
    create: async (userId: number, name: string, consumeKwh: number, model?: string) => {
        return await domesticEquipamentRepository.create(
            userId,
            name,
            consumeKwh,
            model
        )
    },
}