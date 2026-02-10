import { IErrorMessage } from '@/types/zodError';
import { ZodError } from 'zod';
import { Error } from 'mongoose';

// Handle Zod validation errors
export const handleZodError = (error: ZodError) => {
  const errorMessages: IErrorMessage[] = error.issues.map(issue => {
    return {
      path: issue.path.join('.') || 'root',
      message: issue.message,
    };
  });

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages,
  };
};

// Handle Mongoose validation errors
const handleValidationError = (error: Error.ValidationError) => {
  const errorMessages: IErrorMessage[] = Object.values(error.errors).map(
    (el: Error.ValidatorError | Error.CastError) => {
      return {
        path: el.path,
        message: el.message,
      };
    }
  );

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages,
  };
};

export default handleValidationError;
