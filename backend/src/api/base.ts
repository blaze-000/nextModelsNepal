import { os } from '@orpc/server';
import type { ORPCContext } from './context.js';

/**
 * Base procedure with shared ORPC context.
 * All procedures must extend from this to ensure type compatibility in the router.
 */
export const baseProcedure = os.$context<ORPCContext>();

