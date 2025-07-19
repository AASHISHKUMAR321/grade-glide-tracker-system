import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

// Handle validation errors from express-validator
const handleValidationError = (err: any) => {
  const errors = err.array().map((error: any) => ({
    field: error.param,
    message: error.msg,
  }));
  
  return {
    message: 'Validation Error',
    errors,
  };
};

// Handle database errors
const handleDatabaseError = (err: any) => {
  logger.error('Database Error:', err);
  return {
    message: 'Database Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred with the database',
  };
};

// Global error handler middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  
  // Check if it's our custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  
  // Handle express-validator errors
  if (err.name === 'ValidationError') {
    return res.status(400).json(handleValidationError(err));
  }
  
  // Handle database errors
  if (err.name === 'SequelizeError' || err.name === 'SequelizeDatabaseError') {
    return res.status(500).json(handleDatabaseError(err));
  }
  
  // Handle other errors
  return res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
};

// Middleware to catch async errors
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
