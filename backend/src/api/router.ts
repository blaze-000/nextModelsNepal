import { authRouter } from './procedures/auth.procedures.js';
import { heroRouter } from './procedures/hero.procedures.js';
import { navRouter } from './procedures/nav.procedures.js';
import { socialRouter } from './procedures/social.procedures.js';

// ORPC router is just a plain object
export const appRouter = {
  auth: authRouter,
  hero: heroRouter,
  nav: navRouter,
  social: socialRouter,
};

export type AppRouter = typeof appRouter;
