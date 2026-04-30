/**
 * Express error handling middleware
 * Centralized error handling and logging for API endpoints
 */

/**
 * Wrapper untuk async route handlers yang menangani errors secara otomatis
 * Gunakan: app.get('/route', asyncHandler(async (req, res) => { ... }))
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Custom error class untuk API errors
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Error handling middleware - HARUS dipasang TERAKHIR di app.use()
 * Gunakan: app.use(errorHandler)
 */
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error dengan timestamp dan context
  console.error(`[${new Date().toISOString()}] Error ${statusCode}: ${message}`);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error('Stack:', err.stack);
  }
  
  // Return error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}

/**
 * Validation error helper
 */
export function validationError(message) {
  return new ApiError(message, 400);
}

/**
 * Not found error helper
 */
export function notFoundError(message = 'Resource not found') {
  return new ApiError(message, 404);
}

/**
 * Unauthorized error helper
 */
export function unauthorizedError(message = 'Unauthorized') {
  return new ApiError(message, 401);
}
