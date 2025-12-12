import { FastifyReply, FastifyRequest } from 'fastify';

import { domesticEquipamentService } from '../services/domesticEquipamentService';
import { DomesticEquipamentDTO } from 'dtos/domesticEquipamentDTO';

export const domesticEquipamentController = {
    createEquipament: async (
        req: FastifyRequest<{ Body: DomesticEquipamentDTO, Params: { userId: string } }>, 
        reply: FastifyReply
    ) => {
        try {
            const { name, consumeKwh, model } = req.body
            const newEuipament = await domesticEquipamentService.createEquipament(
                Number(req.params.userId),
                (req.user as any).userId,
                name, 
                consumeKwh,
                model
            );

            return reply.code(201).send(newEuipament);
        } catch (err: any) {
            return reply.code(400).send({ error: err.message });
        }
    },

    listEquipaments: async (req: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
        try {
            const equipaments = await domesticEquipamentService.listEquipament(
                Number(req.params.userId),
                (req.user as any).userId
            );
            return reply.code(201).send(equipaments);
        } catch (err: any) {
            return reply.code(400).send({ error: err.message });
        }
    },

    findEquipament: async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const equipament = await domesticEquipamentService.findEquipament(
                Number((req.params as any).id),
                Number((req.params as any).userId),
                (req.user as any).userId
            );
            return reply.code(201).send(equipament);
        } catch (err: any) {
            return reply.code(400).send({ error: err.message });
        }
    },

    updateEquipament: async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const equipament = await domesticEquipamentService.updateEquipament(
                Number((req.params as any).id),
                Number((req.params as any).userId),
                (req.user as any).userId,
                req.body
            )
            return reply.code(201).send(equipament);
        } catch (err: any) {
            return reply.code(400).send({ error: err.message });
        }
    },

    deleteEquipament: async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            await domesticEquipamentService.deleteEquipament(
                Number((req.params as any).id),
                Number((req.params as any).userId),
                (req.user as any).userId
            );
            return reply.code(200).send({message: "Delected user"});
        } catch (err: any) {
            return reply.code(400).send({ error: err.message });
        }
    }
}