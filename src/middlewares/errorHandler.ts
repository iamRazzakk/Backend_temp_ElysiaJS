import { Elysia } from 'elysia';
import { HTTP_STATUS } from '../constants';
import { errorResponse } from '../utils/response';

export const errorHandler = new Elysia()
    .onError(({ code, error, set }) => {
        console.error('Error:', error);

        // Handle different error types
        switch (code) {
            case 'VALIDATION':
                set.status = HTTP_STATUS.BAD_REQUEST;
                return errorResponse('Validation failed', error.message);

            case 'NOT_FOUND':
                set.status = HTTP_STATUS.NOT_FOUND;
                return errorResponse('Resource not found');

            default:
                set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
                return errorResponse(
                    error.message || 'Internal server error',
                    process.env.NODE_ENV === 'development' ? error : undefined
                );
        }
    });
