// Error types for better type safety
export interface ErrorData {
  errors?: Record<string, string>;
  field?: string;
  value?: any;
  errorType: string;
  message?: string;
  details?: any;
}

export interface ErrorResponse {
  success: false;
  message: string;
  data?: ErrorData;
}

// Mongoose error types
export type MongooseErrorType =
  | 'ValidationError'
  | 'CastError'
  | 'DuplicateKeyError'
  | 'MongoError';

// Zod error types
export type ZodErrorType = 'ZodValidationError';

// Elysia error types
export type ElysiaErrorType =
  | 'RequestValidation'
  | 'NotFound'
  | 'ParseError'
  | 'InternalServerError'
  | 'UnknownError';

export type ErrorType = MongooseErrorType | ZodErrorType | ElysiaErrorType;
