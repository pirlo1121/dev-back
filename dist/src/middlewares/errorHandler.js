"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = void 0;
// import { AppError } from "../errors/customErrors";
// AppError
//  * Middleware principal para manejo de errores
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.error('Error capturado:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });
    if (err.isOperational) {
        res.status(err.statusCode).json({
            ok: false,
            msg: err.message,
            ...(err.errors && { errors: err.errors })
        });
        return;
    }
    if (err.name === 'ValidationError') {
        res.status(422).json({
            ok: false,
            msg: 'Error de validación',
            errors: Object.values(err.errors).map((e) => ({
                field: e.path,
                message: e.message
            }))
        });
        return;
    }
    if (err.name === 'CastError') {
        res.status(400).json({
            ok: false,
            msg: `ID inválido: ${err.value}`
        });
        return;
    }
    // Error de duplicado en MongoDB (E11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        res.status(409).json({
            ok: false,
            msg: `El ${field} ya existe`
        });
        return;
    }
    // Errores de JWT
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
            ok: false,
            msg: 'Token inválido'
        });
        return;
    }
    if (err.name === 'TokenExpiredError') {
        res.status(401).json({
            ok: false,
            msg: 'Token expirado'
        });
        return;
    }
    // Errores de Multer
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({
                ok: false,
                msg: 'El archivo es demasiado grande'
            });
            return;
        }
        res.status(400).json({
            ok: false,
            msg: `Error al subir archivo: ${err.message}`
        });
        return;
    }
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
        ok: false,
        msg: isProduction
            ? 'Error interno del servidor'
            : err.message,
        ...((!isProduction) && { stack: err.stack })
    });
};
exports.errorHandler = errorHandler;
//  rutas no encontradas (404)
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        ok: false,
        msg: `Ruta no encontrada: ${req.originalUrl}`
    });
};
exports.notFoundHandler = notFoundHandler;
// Wrapper para funciones async - captura errores automáticamente
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
