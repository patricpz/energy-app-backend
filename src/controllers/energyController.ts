import { FastifyReply, FastifyRequest } from 'fastify';

import { energyService } from '../services/energyService';

export const energyController = {
    listHours: async (
        req: FastifyRequest<{ Params: { 
            userId: string, 
            year: string, 
            month: string, 
            day: string 
        } }>, 
        reply: FastifyReply) => {
        try {
            const userId = Number(req.params.userId);
            const loggerId = (req.user as any).userId;

            const year = Number(req.params.year);
            const month = Number(req.params.month);
            const day = Number(req.params.day)

            if (userId !== loggerId) {
                return reply.code(403).send({ error: "Unauthorized action" })
            }

            const hours = await energyService.listEnergyHours(userId, year, month, day);
            return reply.send(hours);
        } catch (err: any) {
            return reply.code(500).send({ error: err.message });
        }
    },

    listDays: async (
        req: FastifyRequest<{ Params: { 
            userId: string, 
            year: string, 
            month: string 
        } }>, 
        reply: FastifyReply
    ) => {
        try {
            const userId = Number(req.params.userId);
            const loggerId = (req.user as any).userId;

            const year = Number(req.params.year);
            const month = Number(req.params.month);

            if (userId !== loggerId) {
                return reply.code(403).send({ error: "Unauthorized action" })
            }

            const days = await energyService.listEnergyDays(userId, year, month);
            return reply.send(days);
        } catch (err: any) {
            return reply.code(500).send({ error: err.message });
        }
    },

    listMonths: async (
        req: FastifyRequest<{ Params: { userId: string, year: string } }>, 
        reply: FastifyReply
    ) => {
        try {
            const userId = Number(req.params.userId);
            const loggerId = (req.user as any).userId;

            const year = Number(req.params.year);

            if (userId !== loggerId) {
                return reply.code(403).send({ error: "Unauthorized action" })
            }

            const months = await energyService.listEnergyMonths(userId, year);
            return reply.send(months);
        } catch (err: any) {
            return reply.code(500).send({ error: err.message });
        }
    },

    listYears: async (
        req: FastifyRequest<{ Params: { userId: string } }>, 
        reply: FastifyReply
    ) => {
        try {
            const userId = Number(req.params.userId);
            const loggerId = (req.user as any).userId;

            if (userId !== loggerId) {
                return reply.code(403).send({ error: "Unauthorized action" })
            }

            const years = await energyService.listEnergyYears(userId);
            return reply.send(years);
        } catch (err: any) {
            return reply.code(500).send({ error: err.message });
        }
    },
};