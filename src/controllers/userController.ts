import { FastifyReply, FastifyRequest } from 'fastify';

import { userService } from '../services/userService';
import { CreateUserDTO } from '../dtos/createUserDTO';
import { LoginUserDTO } from '../dtos/loginUserDTO';

export const userController = {
  create: async (req: FastifyRequest<{ Body: CreateUserDTO }>, reply: FastifyReply) => {
    try {
      const user = await userService.createUser(req.body);
      return reply.code(201).send(user);
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  },

  update: async (
    req: FastifyRequest<{ Params: { id: string }, Body: any }>,
    reply: FastifyReply
  ) => {
    try {
      const updated = await userService.update(Number(req.params.id), req.body);
      return reply.code(200).send(updated);
    } catch (err: any) {
      return reply.code(400).send({ error: err.message })
    }
  },

  list: async (_: FastifyRequest, reply: FastifyReply) => {
    try {
      const users = await userService.listUsers();
      return reply.send(users);
    } catch (err: any) {
      return reply.code(500).send({ error: err.message });
    }
  },

  findById: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const user = await userService.findUser(Number(req.params.id));
      return reply.code(200).send(user);
    } catch (err: any) {
      return reply.code(404).send({ error: err.message })
    }
  },

  login: async (req: FastifyRequest<{ Body: LoginUserDTO }>, reply: FastifyReply) => {
    try {
      const result = await userService.login(req.body);
      return reply.code(200).send(result);
    } catch (err: any) {
      return reply.code(401).send({ error: err.message });
    }
  },
};
