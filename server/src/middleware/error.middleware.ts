import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { env } from '../config/env';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = err;

  if (!(error instanceof AppError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new AppError(message, statusCode);
  }

  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';

  if (env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      status,
      message: error.message,
      error,
      stack: error.stack,
    });
  } else {
    // Production Mode: Do not leak unhandled stack trace details
    if (error.isOperational) {
      res.status(statusCode).json({
        status,
        message: error.message,
      });
    } else {
      console.error('❌ ERROR:', error);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong on the server',
      });
    }
  }
};
