import { ZodError } from 'zod';
import { Error as MongooseError } from 'mongoose';
import ApiError from './ApiError';
import { handleZodError } from './handleZodError';
import handleValidationError from './handleZodError';
import { IErrorMessage } from '@/types/zodError';
import { envConfig } from '@/config/validEnv';
import { logger } from '@/utils/logger';

interface ErrorResponse {
  success: false;
  message: string;
  errorMessages: IErrorMessage[];
  stack?: string;
}

interface ProcessedError {
  statusCode: number;
  message: string;
  errorMessages: IErrorMessage[];
}

/**
 * Process and format errors consistently across the application
 * @param error - The error to process
 * @returns Processed error with consistent structure
 */
export const processError = (error: any): ProcessedError => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let errorMessages: IErrorMessage[] = [];

  // Log error
  const isProduction = envConfig.nodeEnv === 'production';
  const isDevelopment = envConfig.nodeEnv === 'development';

  if (isDevelopment) {
    // Show clean, readable error format in development
    console.log('🚨 Validation Error:');
    if (error instanceof ZodError) {
      error.issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. Field: ${issue.path.join('.')}`);
        console.log(`      Issue: ${issue.message}`);
      });
    } else {
      console.log('🚨 Error Details:', {
        message: error.message,
        name: error.name,
      });
    }
  } else {
    logger.error('🚨 processError', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
  }

  // Handle Zod validation errors
  if (error instanceof ZodError || error.name === 'ZodError') {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }
  // Handle Mongoose validation errors
  else if (error.name === 'ValidationError') {
    const simplifiedError = handleValidationError(
      error as MongooseError.ValidationError
    );
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }
  // Handle Mongoose Cast errors (invalid ObjectId, etc.)
  else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    errorMessages = [
      {
        path: error.path || '',
        message: 'Invalid ID format provided',
      },
    ];
  }
  // Handle MongoDB duplicate key errors
  else if (error.name === 'MongoServerError' && error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry';
    const keyValue = error.keyValue;
    const field = Object.keys(keyValue || {})[0];
    errorMessages = [
      {
        path: field || '',
        message: `${field || 'Field'} already exists`,
      },
    ];
  }
  // Handle JWT errors
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session Expired';
    errorMessages = [
      {
        path: '',
        message: 'Your session has expired. Please log in again to continue.',
      },
    ];
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid Token';
    errorMessages = [
      {
        path: '',
        message: 'Your token is invalid. Please log in again to continue.',
      },
    ];
  }
  // Handle custom API errors
  else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = [
      {
        path: '',
        message: error.message,
      },
    ];
  }
  // Handle generic errors
  else if (error instanceof Error) {
    message = error.message;
    errorMessages = [
      {
        path: '',
        message: error.message,
      },
    ];
  }

  return {
    statusCode,
    message,
    errorMessages,
  };
};

/**
 * Create a formatted error response
 * @param error - The error to format
 * @returns Formatted error response
 */
export const createErrorResponse = (error: any): ErrorResponse => {
  const processedError = processError(error);
  const isDevelopment = envConfig.nodeEnv === 'development';

  return {
    success: false,
    message: processedError.message,
    errorMessages: processedError.errorMessages,
    ...(isDevelopment && { stack: error?.stack }),
  };
};

export default processError;
