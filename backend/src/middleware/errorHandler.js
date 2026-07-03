import { errorResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return errorResponse(res, 'Validation error', messages, 400);
  }

  if (err.name === 'CastError') {
    return errorResponse(res, 'Invalid ID format', null, 400);
  }

  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', null, 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', null, 401);
  }

  return errorResponse(res, err.message || 'Internal server error', null, 500);
};

export const notFoundHandler = (req, res) => {
  return errorResponse(res, 'Route not found', null, 404);
};
