import { Query } from 'mongoose';

export interface PaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

/**
 * Parse pagination parameters from query string
 * @param query - Query parameters from request
 * @returns Parsed pagination options with defaults
 */
export const parsePaginationParams = (query: Record<string, any>): PaginationOptions => {
    const page = Math.max(1, parseInt(query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 10));
    const sortBy = query.sortBy as string || 'createdAt';
    const sortOrder = (query.sortOrder as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    return {
        page,
        limit,
        sortBy,
        sortOrder,
    };
};

/**
 * Apply pagination to a Mongoose query
 * @param query - Mongoose query object
 * @param options - Pagination options
 * @returns Paginated result with metadata
 */
export const paginate = async <T>(
    query: Query<T[], T>,
    options: PaginationOptions
): Promise<PaginationResult<T>> => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: Record<string, 1 | -1> = {
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    // Execute query with pagination
    const [data, totalItems] = await Promise.all([
        query.sort(sort).skip(skip).limit(limit).exec(),
        query.model.countDocuments(query.getFilter()),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limit);

    return {

        pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit
        },
        data,
    };
};

/**
 * Create pagination metadata without executing query (for manual pagination)
 * @param totalItems - Total number of items
 * @param page - Current page number
 * @param limit - Items per page
 * @returns Pagination metadata
 */
export const createPaginationMeta = (totalItems: number, page: number, limit: number) => {
    const totalPages = Math.ceil(totalItems / limit);

    return {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit
    };
};
