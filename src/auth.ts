import secureSession from "@fastify/secure-session";
import passport from "@fastify/passport";
import { Strategy, StrategyVerifyCallbackUserInfo } from "openid-client";
import { FastifyInstance } from "fastify";
import createOpenIdClient from "@/appsumAuthServerProvider";
import { User } from "../types";
import { REDIRECT_COOKIE_NAME } from "@/constants";

const isProduction = false;

export async function initiateAuth(app: FastifyInstance) {
  const authServerUri = process.env.AUTH_SERVER_URI;

  const requireAuthPaths = ["/api/v1/user", "/app", "/app/*"];

  // Should come from vault, generate a new 32 bytes (256 bit key):
  // openssl rand -base64 32
  const secrets = ["EjkjtGu+LQdj0JtwZhGJOVF7N/iA1PnaUFYGp6qo1aQ="];

  if (!authServerUri) {
    throw new Error("Please add your AUTH_SERVER_URI to .env");
  }
  const openIdClient = await createOpenIdClient(authServerUri);
  const verifyCallback: StrategyVerifyCallbackUserInfo<User> = (tokenSet, userInfo, done) => {
    const user = { ...tokenSet.claims(), ...userInfo };
    return done(null, user);
  };
  passport.use("oidc", new Strategy({ client: openIdClient, usePKCE: true }, verifyCallback));

  passport.registerUserSerializer(async (user: User, request) => user);
  passport.registerUserDeserializer(async (user: User, request) => user);

  app.register(secureSession, {
    key: secrets,
    cookieName: "__AppsumCrypto-SessionId",
    cookie: {
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax", // On production, the identityserver should run on a subdomain of the app
    },
  });
  app.register(passport.initialize());
  app.register(passport.secureSession());
  //   router.get('/login', csrfProtection, (req, res, next) => {
  //     if (req.user) {
  //       return res.redirect('/');
  //     }
  //     return passport.authenticate('oidc', { scope: 'openid profile email' })(
  //       req,
  //       res,
  //       next
  //     );
  //   });
  //   router.get('/login/callback', (req, res, next) => {
  //     res.clearCookie(REDIRECT_COOKIE_NAME);
  //     console.log(req);
  //     return passport.authenticate('oidc', {
  //       failureRedirect: '/error',
  //       successRedirect: req.cookies[REDIRECT_COOKIE_NAME],
  //     })(req, res, next);
  //   });
  //   router.get('/logout', (req, res) => {
  //     res.redirect(openIdClient.endSessionUrl());
  //   });
  //   router.get('/logout/callback', (req, res) => {
  //     req.logout(() => res.redirect('/'));
  //   });

  //   router.get('/me', (req, res) => {
  //     res.send(req.user);
  //   });

  //   return { router, PassportMiddleware };
}

let count = 1;

const printDataMiddleware = (req: any, res: any, next: any) => {
  console.log("\n==============================");
  console.log(`------------>  ${count++}`);

  console.log(`\n req.session.passport -------> `);
  console.log(req.session.passport);

  console.log(`\n req.user -------> `);
  console.log(req.user);

  console.log("\n Session and Cookie");
  console.log(`req.session.id -------> ${req.session.id}`);
  console.log(`req.session.cookie -------> `);
  console.log(req.session.cookie);
  console.log(`redirectUrl: ${req.cookies[REDIRECT_COOKIE_NAME]}`);

  console.log("===========================================\n");

  next();
};

export { /* initiateAuthMiddleware ,*/ printDataMiddleware };
