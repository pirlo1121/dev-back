// src/middlewares/auth.js
import { verifyToken } from "../helpers/helper.hash.js";
import { UnauthorizedError, ForbiddenError } from '../errors/customErrors.js';

export function auth(req, res, next) {
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
export function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    throw new ForbiddenError("Acceso denegado: se requiere rol de administrador");
  }
  next();
}