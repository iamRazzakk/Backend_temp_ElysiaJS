import { Elysia } from 'elysia';
import { ZodError } from 'zod';
import { Error as MongooseError } from 'mongoose';
import ApiError from '@/error/ApiError';
import { handleZodError } from '@/error/handleZodError';
import handleValidationError from '@/error/handleZodError';
import { IErrorMessage } from '@/types/zodError';
import { logger } from '@/utils/logger';
import { envConfig } from '@/config/validEnv';

interface ErrorResponse {
  success: false;
  message: string;
  source: string;
  errors: Array<{
    path: string;
    message: string;
  }>;
  stack?: string;
}

export const errorHandler = new Elysia({ name: 'errorHandler' }).onError(
  ({ code, error, set, request }) => {
    let statusCode = 500;
    let message = 'Something went wrong';
    let errorMessages: IErrorMessage[] = [];
    let errorSource = 'UNKNOWN';

    // Extract route information
    const method = request.method;
    const url = new URL(request.url);
    const route = `${method} ${url.pathname}`;

    // Environment check
    const isProduction = envConfig.nodeEnv === 'production';
    const isDevelopment = envConfig.nodeEnv === 'development';

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      errorSource = 'ZOD';
      const simplifiedError = handleZodError(error);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorMessages = simplifiedError.errorMessages;

      // Show clean error format in development
      if (isDevelopment) {
        console.log('\n❌ VALIDATION FAILED ❌');
        error.issues.forEach((issue, index) => {
          console.log(
            `   ${index + 1}. Field: ${issue.path.join('.')} → ${issue.message}`
          );
        });
        console.log('━'.repeat(50));
      }
    }
    // Handle Mongoose validation errors
    else if ((error as any)?.name === 'ValidationError') {
      errorSource = 'MONGOOSE';
      const simplifiedError = handleValidationError(
        error as MongooseError.ValidationError
      );
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorMessages = simplifiedError.errorMessages;
    }
    // Handle Mongoose Cast errors (invalid ObjectId, etc.)
    else if ((error as any)?.name === 'CastError') {
      errorSource = 'MONGOOSE';
      statusCode = 400;
      message = 'Invalid ID format';
      errorMessages = [
        {
          path: (error as any)?.path || '',
          message: 'Invalid ID format provided',
        },
      ];
    }
    // Handle MongoDB duplicate key errors
    else if (
      (error as any)?.name === 'MongoServerError' &&
      (error as any)?.code === 11000
    ) {
      errorSource = 'MONGODB';
      statusCode = 409;
      message = 'Duplicate entry';
      const keyValue = (error as any)?.keyValue;
      const field = Object.keys(keyValue || {})[0];
      errorMessages = [
        {
          path: field,
          message: `${field} already exists`,
        },
      ];
    }
    // Handle JWT errors
    else if ((error as any)?.name === 'TokenExpiredError') {
      errorSource = 'JWT';
      statusCode = 401;
      message = 'Session Expired';
      errorMessages = [
        {
          path: '',
          message: 'Your session has expired. Please log in again to continue.',
        },
      ];
    } else if ((error as any)?.name === 'JsonWebTokenError') {
      errorSource = 'JWT';
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
      errorSource = 'API';
      statusCode = error.statusCode;
      message = error.message;
      errorMessages = [
        {
          path: '',
          message: error.message,
        },
      ];
    }
    // Handle Elysia built-in errors
    else if (code === 'VALIDATION') {
      errorSource = 'ELYSIA';
      statusCode = 400;
      message = 'Validation Error';

      // Extract detailed validation errors from Elysia
      try {
        const errorDetails = error as any;

        // Check if error has validator details
        if (errorDetails?.validator?.Errors) {
          // Parse Elysia/TypeBox validation errors
          const validationErrors = Array.from(errorDetails.validator.Errors);
          errorMessages = validationErrors.map((err: any) => ({
            path: err.path || err.schema?.title || 'unknown',
            message: err.message || 'Invalid value',
          }));

          if (errorMessages.length > 0) {
            message = `Validation failed for ${errorMessages.length} field(s)`;
          }
        } else if (
          errorDetails?.message &&
          errorDetails.message !== 'Validation Error'
        ) {
          // Handle single validation error with message
          errorMessages = [
            {
              path: errorDetails?.path || '',
              message: errorDetails.message,
            },
          ];
          message = errorDetails.message;
        } else {
          // Fallback for unknown validation error structure
          errorMessages = [
            {
              path: '',
              message: errorDetails?.message || 'Invalid request data',
            },
          ];
        }
      } catch (e) {
        // Fallback if parsing fails
        errorMessages = [
          {
            path: '',
            message: (error as any)?.message || 'Invalid request data',
          },
        ];
      }
    } else if (code === 'NOT_FOUND') {
      errorSource = 'ELYSIA';
      statusCode = 404;
      message = 'Route not found';
      errorMessages = [
        {
          path: '',
          message: 'The requested route does not exist',
        },
      ];
    } else if (code === 'PARSE') {
      errorSource = 'ELYSIA';
      statusCode = 400;
      message = 'Parse Error';
      errorMessages = [
        {
          path: '',
          message: 'Invalid request format',
        },
      ];
    } else if (code === 'INTERNAL_SERVER_ERROR') {
      errorSource = 'ELYSIA';
      statusCode = 500;
      message = 'Internal Server Error';
      errorMessages = [
        {
          path: '',
          message: 'An internal server error occurred',
        },
      ];
    }
    // Handle generic errors and unknown errors
    else {
      if (error instanceof Error) {
        errorSource = 'SYSTEM';
        message = error.message;
        errorMessages = [
          {
            path: '',
            message: error.message,
          },
        ];
      } else {
        errorSource = 'UNKNOWN';
        message = (error as any)?.message || 'Unknown error occurred';
        errorMessages = [
          {
            path: '',
            message: (error as any)?.message || 'An unexpected error occurred',
          },
        ];
      }
    }

    // Always log to logger for records (regardless of environment)
    console.log(`💥 ${route} - ${errorSource} ERROR: ${message}`);
    logger.error(`🚨 ${errorSource} ERROR on ${route}:`, {
      route,
      method,
      url: url.href,
      message: (error as any)?.message || 'Unknown error',
      stack: (error as any)?.stack,
      code,
      source: errorSource,
      statusCode,
    });

    set.status = statusCode as any;

    // Create clean, readable error response
    if (isDevelopment && error instanceof ZodError) {
      // Simple, readable format for development
      return {
        success: false,
        message: 'Validation failed',
        errors: errorMessages.map(err => ({
          field: err.path.toString() || 'unknown',
          issue: err.message,
        })),
      };
    }

    // Standard format for production or non-validation errors
    const errorResponse: ErrorResponse = {
      success: false,
      message,
      source: errorSource,
      errors: errorMessages.map(err => ({
        path: err.path.toString(),
        message: err.message,
      })),
      ...(isDevelopment && { stack: (error as any)?.stack }),
    };

    return errorResponse;
  }
);
