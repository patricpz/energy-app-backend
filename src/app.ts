import Fastify from "fastify";
import userRoutes from "./routes/useRoutes";

const app = Fastify({ logger: true });

app.register(userRoutes, { prefix: "/api" });

export default app;


