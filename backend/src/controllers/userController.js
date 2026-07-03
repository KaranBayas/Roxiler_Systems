import { getAllUsers, deleteUser, createAdminUser } from '../services/userService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { validateEmail, validateName } from '../utils/validators.js';
import { validatePassword as validatePwd } from '../utils/password.js';

export const listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', order = 'desc' } = req.query;

    const { users, total } = await getAllUsers(parseInt(page), parseInt(limit), search, sortBy, order);

    return paginatedResponse(res, users, total, page, limit, 'Users retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, null, 500);
  }
};

export const removeUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (parseInt(userId) === req.user.userId) {
      return errorResponse(res, 'Cannot delete your own account', null, 400);
    }

    const result = await deleteUser(parseInt(userId));
    return successResponse(res, result, 'User deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, null, error.message.includes('not found') ? 404 : 500);
  }
};

export const addUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return errorResponse(res, 'Email, name, and password are required', null, 400);
    }

    if (!validateEmail(email)) {
      return errorResponse(res, 'Invalid email format', null, 400);
    }

    if (!validateName(name)) {
      return errorResponse(res, 'Name must be 2-100 characters', null, 400);
    }

    const pwdValidation = validatePwd(password);
    if (!pwdValidation.isValid) {
      return errorResponse(res, 'Password validation failed', pwdValidation.errors, 400);
    }

    const user = await createAdminUser(email, name, password);
    return successResponse(res, user, 'Admin user created successfully', 201);
  } catch (error) {
    if (error.message.includes('already exists')) {
      return errorResponse(res, error.message, null, 409);
    }
    return errorResponse(res, error.message, null, 500);
  }
};
