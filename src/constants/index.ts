export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  PRODUCT_NOT_FOUND: 'Product not found',
  INSUFFICIENT_STOCK: 'Insufficient stock available',
  CART_NOT_FOUND: 'Cart not found',
  INVALID_QUANTITY: 'Invalid quantity',
  DATABASE_ERROR: 'Database operation failed',
  API_NOT_FOUND: 'API not found',
  VALIDATION_FAILED: 'Validation failed',
  INVALID_ID_FORMAT: 'Invalid ID format',
  DUPLICATE_ENTRY: 'Duplicate entry found',
  INVALID_REQUEST_FORMAT: 'Invalid request format',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  FORBIDDEN_ACTION: 'Forbidden action',
} as const;

export const SUCCESS_MESSAGES = {
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_FETCHED: 'Product fetched successfully',
  PRODUCTS_FETCHED: 'Products fetched successfully',
  CART_UPDATED: 'Cart updated successfully',
  CART_FETCHED: 'Cart fetched successfully',
} as const;
