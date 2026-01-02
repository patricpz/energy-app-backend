import { FastifyReply, FastifyRequest } from 'fastify';

import { energyService } from '../services/energyService';

export const energyController = {
    listHours: async (
        req: FastifyRequest<{ Params: { 
            userId: string, 
            yearId: string, 
            monthId: string, 
            dayId: string 
        } }>, 
        reply: FastifyReply) => {
        try {
            const userId = Number(req.params.userId);
            const loggerId = (req.user as any).userId;

            const yearId = Number(req.params.yearId);
            const monthId = Number(req.params.monthId);
            const dayId = Number(req.params.dayId)

            if (userId !== loggerId) {
                return reply.code(403).send({ error: "Unauthorized action" })
            }

            const hours = await energyService.listEnergyHours(userId, yearId, monthId, dayId);
            return reply.send(hours);
        } catch (err: any) {
            return reply.code(500).send({ error: err.message });
        }
    },

    listDays: async (
        req: FastifyRequest<{ Params: { 
            userId: string, 
            yearId: string, 
            monthId: string 
        } }>, 
        reply: FastifyReply
    ) => {
        try {
            const userId = Number(req.params.userId);
            const loggerId = (req.user as any).userId;

            const yearId = Number(req.params.yearId);
            const monthId = Number(req.params.monthId);

            if (userId !== loggerId) {
                return reply.code(403).send({ error: "Unauthorized action" })
            }

            const days = await energyService.listEnergyDays(userId, yearId, monthId);
            return reply.send(days);
        } catch (err: any) {
            return reply.code(500).send({ error: err.message });
        }
    },

    listMonths: async (
        req: FastifyRequest<{ Params: { userId: string, yearId: string } }>, 
        reply: FastifyReply
    ) => {
        try {
            const userId = Number(req.params.userId);
            const loggerId = (req.user as any).userId;

            const yearId = Number(req.params.yearId);

            if (userId !== loggerId) {
                return reply.code(403).send({ error: "Unauthorized action" })
            }

            const months = await energyService.listEnergyMonths(userId, yearId);
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