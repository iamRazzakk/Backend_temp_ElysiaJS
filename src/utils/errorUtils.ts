import ApiError from '@/error/ApiError';

/**
 * HTTP Status Code Constants
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Throw a Bad Request error (400)
 */
export const throwBadRequest = (message: string = 'Bad Request'): never => {
  throw new ApiError(HTTP_STATUS.BAD_REQUEST, message);
};

/**
 * Throw an Unauthorized error (401)
 */
export const throwUnauthorized = (message: string = 'Unauthorized'): never => {
  throw new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
};

/**
 * Throw a Forbidden error (403)
 */
export const throwForbidden = (message: string = 'Forbidden'): never => {
  throw new ApiError(HTTP_STATUS.FORBIDDEN, message);
};

/**
 * Throw a Not Found error (404)
 */
export const throwNotFound = (message: string = 'Not Found'): never => {
  throw new ApiError(HTTP_STATUS.NOT_FOUND, message);
};

/**
 * Throw a Conflict error (409)
 */
export const throwConflict = (message: string = 'Conflict'): never => {
  throw new ApiError(HTTP_STATUS.CONFLICT, message);
};

/**
 * Throw an Unprocessable Entity error (422)
 */
export const throwValidationError = (
  message: string = 'Validation Error'
): never => {
  throw new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, message);
};

/**
 * Throw an Internal Server Error (500)
 */
export const throwInternalError = (
  message: string = 'Internal Server Error'
): never => {
  throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
};

/**
 * Generic error thrower
 */
export const throwError = (statusCode: number, message: string): never => {
  throw new ApiError(statusCode, message);
};
