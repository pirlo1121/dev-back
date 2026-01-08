"use strict";
//   Errores personalizados
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ValidationError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
//  400 - Bad Request
class BadRequestError extends AppError {
    constructor(message = 'Solicitud incorrecta') {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
//  401 - Unauthorized
class UnauthorizedError extends AppError {
    constructor(message = 'No autorizado') {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
//  403 - Forbidden
class ForbiddenError extends AppError {
    constructor(message = 'Acceso denegado') {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
//  404 - Not Found
class NotFoundError extends AppError {
    constructor(message = 'Recurso no encontrado') {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
//  409 - Conflict
class ConflictError extends AppError {
    constructor(message = 'Conflicto con el estado actual') {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
//  422 - Unprocessable Entity
class ValidationError extends AppError {
    constructor(message = 'Error de validación', errors = []) {
        super(message, 422);
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
//  500 - Internal Server Error
class InternalServerError extends AppError {
    constructor(message = 'Error interno del servidor') {
        super(message, 500);
    }
}
exports.InternalServerError = InternalServerError;
