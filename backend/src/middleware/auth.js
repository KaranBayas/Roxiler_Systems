import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return errorResponse(res, 'No token provided', null, 401);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return errorResponse(res, 'Invalid or expired token', null, 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 'Authentication failed', null, 401);
  }
};

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'User not authenticated', null, 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 'Insufficient permissions', null, 403);
    }

    next();
  };
};
