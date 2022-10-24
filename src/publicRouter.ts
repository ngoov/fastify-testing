import { FastifyInstance } from "fastify";
import indexController from "./controller/indexController";

export default async function publicRouter(fastify: FastifyInstance) {
  fastify.register(indexController, { prefix: "/" });
}
