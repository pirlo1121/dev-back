//   Errores personalizados

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}


//  400 - Bad Request

export class BadRequestError extends AppError {
  constructor(message: string = 'Solicitud incorrecta') {
    super(message, 400);
  }
}


//  401 - Unauthorized

export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(message, 401);
  }
}


//  403 - Forbidden

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acceso denegado') {
    super(message, 403);
  }
}


//  404 - Not Found

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404);
  }
}


//  409 - Conflict

export class ConflictError extends AppError {
  constructor(message: string = 'Conflicto con el estado actual') {
    super(message, 409);
  }
}


//  422 - Unprocessable Entity

export class ValidationError extends AppError {
  public errors: any[];
  constructor(message: string = 'Error de validación', errors: any[] = []) {
    super(message, 422);
    this.errors = errors;
  }
}

//  500 - Internal Server Error
export class InternalServerError extends AppError {
  constructor(message: string = 'Error interno del servidor') {
    super(message, 500);
  }
}