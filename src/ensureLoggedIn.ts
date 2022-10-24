import { FastifyRequest, FastifyReply } from "fastify";
import { REDIRECT_COOKIE_NAME } from "./constants";

export function ensureLoggedIn(req: FastifyRequest, reply: FastifyReply) {
  if (req.isAuthenticated()) {
    return reply;
  }
  console.log("not logged in: ");
  reply.setCookie(REDIRECT_COOKIE_NAME, req.url);
  reply.header("x-csrf-token", reply.generateCsrf());
  return reply.redirect("/login");
}
