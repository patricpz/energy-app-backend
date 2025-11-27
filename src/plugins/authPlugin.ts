import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin"
import jwt from "jsonwebtoken"

export default fp(async (fastify) => {
    fastify.decorate("authenticate", async(req: FastifyRequest, reply: FastifyReply) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return reply.status(401).send({ error: "Unauthorized" });
            }

            const token = authHeader.replace("Bearer ", "");

            const secret = process.env.JWT_SECRET;

            if (!secret) {
                throw new Error("JWT_SECRET não configurado");
            }

            const decoded = jwt.verify(token, secret);

            req.user = decoded;
        } catch (err) {
            return reply.status(401).send({ error: "Invalid token" });
        }
    })
})