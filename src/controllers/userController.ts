import { FastifyReply, FastifyRequest } from "fastify";
import { userService } from "../services/userService";

export const userController = {
  create: async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await userService.createUser(req.body as any);
      return reply.code(201).send(user);
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  },

  list: async (_: FastifyRequest, reply: FastifyReply) => {
    const users = await userService.listUsers();
    return reply.send(users);
  },
};
