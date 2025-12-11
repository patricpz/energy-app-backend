import { FastifyReply, FastifyRequest } from 'fastify';

import { domesticEquipamentService } from '../services/domesticEquipamentService';
import { DomesticEquipamentDTO } from 'dtos/domesticEquipamentDTO';

export const domesticEquipamentController = {
    create: async (
        req: FastifyRequest<{ Body: DomesticEquipamentDTO, Params: { userId: string } }>, 
        reply: FastifyReply
    ) => {
        try {
            const { name, consumeKwh, model } = req.body;
            const userId = Number(req.params.userId);
            const loggerUser = (req.user as any).userId;

            if (userId !== loggerUser) {
                return reply.code(403).send("Unauthorized action");
            }

            const newEuipament = await domesticEquipamentService.create(
                userId,
                name, 
                consumeKwh,
                model
            );

            return reply.code(201).send(newEuipament);
        } catch (err: any) {
            return reply.code(400).send({ error: err.message });
        }
    },

    list: async (req: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
        const userId = Number(req.params.userId);
        const loggerUserId = (req.user as any).userId;
        if (userId !== loggerUserId) {
            return reply.code(403).send("Unauthorized action");
        }

        const equipaments = await domesticEquipamentService.list(userId);
        return reply.code(201).send(equipaments);
    }
}