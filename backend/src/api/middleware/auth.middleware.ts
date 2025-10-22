import { ORPCError } from '@orpc/server';
import { baseProcedure } from '../base.js';

export const requireAdminMiddleware = baseProcedure.middleware(async ({ context, next }) => {
  if (!context.admin || context.admin.role !== 'admin') {
    throw new ORPCError('UNAUTHORIZED', {
      message: 'Admin authentication required',
    });
  }

  return next();
});
