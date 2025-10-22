import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

type AdminClaims = {
  role: string;
  email: string;
};

export type ORPCContext = {
  req: Request;
  res: Response;
  admin: AdminClaims | null;
  authToken: string | null;
};

export type CreateContextOptions = {
  req: Request;
  res: Response;
};

export async function createContext({ req, res }: CreateContextOptions): Promise<ORPCContext> {
  // 1. Try Authorization header first (for API clients)
  const authorization = req.header('authorization') ?? req.header('Authorization');
  let bearerToken = extractBearerToken(authorization);

  // 2. Fallback to token cookie (for browser requests)
  if (!bearerToken && req.cookies?.token) {
    bearerToken = req.cookies.token;
  }

  const admin = bearerToken ? verifyAdminToken(bearerToken) : null;

  return {
    req,
    res,
    admin,
    authToken: bearerToken,
  };
}

function extractBearerToken(authorizationHeader?: string | null): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, rawToken] = authorizationHeader.split(/\s+/);

  if (!scheme || scheme.toLowerCase() !== 'bearer') {
    return null;
  }

  return rawToken ?? null;
}

function verifyAdminToken(token: string): AdminClaims | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as AdminClaims | jwt.JwtPayload;

    if (typeof decoded === 'object' && decoded !== null && 'role' in decoded && 'email' in decoded) {
      return {
        role: decoded.role as string,
        email: decoded.email as string,
      };
    }

    return null;
  } catch {
    return null;
  }
}
