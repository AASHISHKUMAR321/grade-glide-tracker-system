export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
    
    // Set the prototype explicitly
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Helper functions to create specific error types
export const BadRequestError = (message: string): AppError => {
  return new AppError(message, 400);
};

export const UnauthorizedError = (message: string): AppError => {
  return new AppError(message, 401);
};

export const ForbiddenError = (message: string): AppError => {
  return new AppError(message, 403);
};

export const NotFoundError = (message: string): AppError => {
  return new AppError(message, 404);
};

export const ConflictError = (message: string): AppError => {
  return new AppError(message, 409);
};

export const InternalServerError = (message: string): AppError => {
  return new AppError(message, 500, false);
};
