import app from "./app";

const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 3006;
app.listen({ port: FASTIFY_PORT }, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});

console.log(`🚀  Fastify server running at http://localhost:${FASTIFY_PORT}/`);
console.log(`Route index: /`);
console.log(`Private user route: /api/v1/user`);
