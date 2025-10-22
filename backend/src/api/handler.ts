import type { NextFunction, Request, Response } from 'express';
import { RPCHandler } from '@orpc/server/node';
import { appRouter } from './router.js';
import { createContext } from './context.js';

const rpcHandler = new RPCHandler(appRouter);
const RPC_PREFIX = '/api/rpc';

export async function orpcExpressHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { matched } = await rpcHandler.handle(req, res, {
      prefix: RPC_PREFIX,
      context: await createContext({ req, res }),
    });

    if (!matched) {
      next();
    }
  } catch (error) {
    next(error);
  }
}
