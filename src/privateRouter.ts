import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import userController from "./controller/userController";

export default async function publicRouter(routerPlugin: FastifyInstance) {
  routerPlugin.addHook("preValidation", async (req, reply) => {
    reply.header("X-PreVal", "publicRouter");
  });
  routerPlugin.register(userController, { prefix: "/api/v1/user" });
  routerPlugin.get("/private", async function (req: FastifyRequest, reply: FastifyReply) {
    reply.send({
      thisIsPrivate: "hi",
    });
  });
  const appHandler = async function (req: FastifyRequest, reply: FastifyReply) {
    reply.send(`Welcome to the app, subroute ${req.url}`);
  };
  routerPlugin.get("/app", appHandler);
  routerPlugin.get("/app/*", appHandler);
}
