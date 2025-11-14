import { FastifyInstance } from "fastify";
import { userController } from "../controllers/userController";

export default async function userRoutes(app: FastifyInstance) {
  app.post("/users", userController.create);
  app.get("/users", userController.list);
}
