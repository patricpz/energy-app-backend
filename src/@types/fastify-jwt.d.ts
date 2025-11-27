import "fastify";

declare module "fastify" {
    interface FastifyRequest {
        user?: any;
    }

    interface FastifyInstance {
        authenticate: any;
    }
}