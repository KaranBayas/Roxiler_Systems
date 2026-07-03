import { registerUser, loginUser, getUserById, updateUser, changePassword } from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { validateEmail, validateName } from '../utils/validators.js';
import { validatePassword as validatePwd } from '../utils/password.js';

export const register = async (req, res) => {
  try {
    const { email, name, password, confirmPassword } = req.body;

    // Validation
    if (!email || !name || !password || !confirmPassword) {
      return errorResponse(res, 'All fields are required', null, 400);
    }

    if (!validateEmail(email)) {
      return errorResponse(res, 'Invalid email format', null, 400);
    }

    if (!validateName(name)) {
      return errorResponse(res, 'Name must be 2-100 characters', null, 400);
    }

    if (password !== confirmPassword) {
      return errorResponse(res, 'Passwords do not match', null, 400);
    }

    const pwdValidation = validatePwd(password);
    if (!pwdValidation.isValid) {
      return errorResponse(res, 'Password validation failed', pwdValidation.errors, 400);
    }

    const result = await registerUser(email, name, password);
    return successResponse(res, result, 'User registered successfully', 201);
  } catch (error) {
    if (error.message.includes('already exists')) {
      return errorResponse(res, error.message, null, 409);
    }
    return errorResponse(res, error.message, null, 500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', null, 400);
    }

    const result = await loginUser(email, password);
    return successResponse(res, result, 'Login successful', 200);
  } catch (error) {
    return errorResponse(res, error.message, null, 401);
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.userId);
    return successResponse(res, user, 'Profile retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, null, 404);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return errorResponse(res, 'At least one field is required', null, 400);
    }

    if (name && !validateName(name)) {
      return errorResponse(res, 'Name must be 2-100 characters', null, 400);
    }

    if (email && !validateEmail(email)) {
      return errorResponse(res, 'Invalid email format', null, 400);
    }

    const user = await updateUser(req.user.userId, { name, email });
    return successResponse(res, user, 'Profile updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return errorResponse(res, 'All fields are required', null, 400);
    }

    if (newPassword !== confirmPassword) {
      return errorResponse(res, 'Passwords do not match', null, 400);
    }

    const pwdValidation = validatePwd(newPassword);
    if (!pwdValidation.isValid) {
      return errorResponse(res, 'Password validation failed', pwdValidation.errors, 400);
    }

    if (oldPassword === newPassword) {
      return errorResponse(res, 'New password must be different from old password', null, 400);
    }

    const result = await changePassword(req.user.userId, oldPassword, newPassword);
    return successResponse(res, result, 'Password changed successfully');
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};
