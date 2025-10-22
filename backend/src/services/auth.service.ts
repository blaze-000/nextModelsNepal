import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import { AdminModel } from '../models/admin.model.js';

export type SessionPayload = {
  role: 'admin';
  email: string;
};

type AuthenticateResult = {
  token: string;
  payload: SessionPayload;
};

export class AuthServiceError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AuthServiceError(500, 'JWT secret is not configured');
  }
  return secret;
}

export const AuthService = {
  async authenticateAdmin(email: string, password: string): Promise<AuthenticateResult> {
    if (!email || !password) {
      throw new AuthServiceError(400, 'Email and password are required');
    }

    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      throw new AuthServiceError(401, 'Invalid credentials');
    }

    if (!admin.password) {
      throw new AuthServiceError(500, 'Admin account error');
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      throw new AuthServiceError(401, 'Invalid credentials');
    }

    const payload: SessionPayload = {
      role: 'admin',
      email: admin.email,
    };

    const token = jwt.sign(payload, getJwtSecret(), {
      expiresIn: '7d',
    });

    return { token, payload };
  },

  setAuthCookies(res: Response, { payload, token }: AuthenticateResult): void {
    const isProd = process.env.PRODUCTION === 'TRUE';

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('session', encodeURIComponent(JSON.stringify(payload)), {
      httpOnly: false,
      path: '/',
      secure: isProd,
      sameSite: isProd ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  },
};

