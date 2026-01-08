"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
exports.isAdmin = isAdmin;
// src/middlewares/auth.js
const helper_hash_1 = require("../helpers/helper.hash");
const customErrors_1 = require("../errors/customErrors");
function auth(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        throw new customErrors_1.ForbiddenError("Token requerido");
    }
    const decode = (0, helper_hash_1.verifyToken)(token);
    if (!decode) {
        throw new customErrors_1.UnauthorizedError("Token inválido o expirado");
    }
    req.user = decode;
    next();
}
// Middleware adicional para verificar rol de admin
function isAdmin(req, res, next) {
    if (!req.user || (typeof req.user !== 'string' && req.user.role !== 'admin')) {
        throw new customErrors_1.ForbiddenError("Acceso denegado: se requiere rol de administrador");
    }
    next();
}
