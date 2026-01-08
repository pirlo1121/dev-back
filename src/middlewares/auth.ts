// src/middlewares/auth.js
import { verifyToken } from "../helpers/helper.hash";
import { UnauthorizedError, ForbiddenError } from '../errors/customErrors';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    throw new ForbiddenError("Token requerido");
  }

  const decode = verifyToken(token);

  if (!decode) {
    throw new UnauthorizedError("Token inválido o expirado");
  }

  req.user = decode;
  next();
}

// Middleware adicional para verificar rol de admin
export function isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || (typeof req.user !== 'string' && (req.user as any).role !== 'admin')) {
    throw new ForbiddenError("Acceso denegado: se requiere rol de administrador");
  }
  next();
}