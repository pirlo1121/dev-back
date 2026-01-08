"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: 24 * 60 * 60 * 1000,
    max: 3,
    message: {
        message: "Demasiados intentos de inicio de sesión, inténtalo de nuevo más tarde."
    },
    standardHeaders: true, // incluye info en headers RateLimit
    legacyHeaders: false, // desactivar X-RateLimit-*
});
