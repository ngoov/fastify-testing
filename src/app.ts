import fastify from "fastify";
import secureSession from "@fastify/secure-session";
import csrfProtection from "@fastify/csrf-protection";
import helmet from "@fastify/helmet";
import cookie from "@fastify/cookie";
import publicRouter from "./publicRouter";
import privateRouter from "./privateRouter";
// import { initiateAuth, initiateAuthMiddleware, printDataMiddleware } from "./auth";

const server = fastify({
  // Logger only for production
  logger: true,
});

// Middleware: Router
// server.register(auth);
server.register(cookie, {});
server.register(csrfProtection, { sessionPlugin: "@fastify/secure-session" });
server.register(publicRouter);
server.register(privateRouter);

export default server;
