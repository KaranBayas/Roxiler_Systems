import {
  createRating,
  updateRating,
  deleteRating,
  getRatingsByStore,
  getRatingsByUser,
  getUserRatingForStore,
  getStoreStats,
} from '../services/ratingService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { validateScore, validateComment } from '../utils/validators.js';

export const submitRating = async (req, res) => {
  try {
    const { storeId, score, comment } = req.body;

    if (!storeId || !score) {
      return errorResponse(res, 'Store ID and score are required', null, 400);
    }

    if (!validateScore(score)) {
      return errorResponse(res, 'Score must be between 1 and 5', null, 400);
    }

    if (!validateComment(comment)) {
      return errorResponse(res, 'Comment must not exceed 1000 characters', null, 400);
    }

    const rating = await createRating(req.user.userId, parseInt(storeId), score, comment || '');
    return successResponse(res, rating, 'Rating submitted successfully', 201);
  } catch (error) {
    if (error.message.includes('already rated')) {
      return errorResponse(res, error.message, null, 409);
    }
    if (error.message.includes('not found')) {
      return errorResponse(res, error.message, null, 404);
    }
    return errorResponse(res, error.message, null, 500);
  }
};

export const editRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { score, comment } = req.body;

    if (!score) {
      return errorResponse(res, 'Score is required', null, 400);
    }

    if (!validateScore(score)) {
      return errorResponse(res, 'Score must be between 1 and 5', null, 400);
    }

    if (!validateComment(comment)) {
      return errorResponse(res, 'Comment must not exceed 1000 characters', null, 400);
    }

    const rating = await updateRating(parseInt(ratingId), req.user.userId, score, comment || '');
    return successResponse(res, rating, 'Rating updated successfully');
  } catch (error) {
    if (error.message.includes('own ratings')) {
      return errorResponse(res, error.message, null, 403);
    }
    if (error.message.includes('not found')) {
      return errorResponse(res, error.message, null, 404);
    }
    return errorResponse(res, error.message, null, 500);
  }
};

export const removeRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const result = await deleteRating(parseInt(ratingId), req.user.userId);
    return successResponse(res, result, 'Rating deleted successfully');
  } catch (error) {
    if (error.message.includes('own ratings')) {
      return errorResponse(res, error.message, null, 403);
    }
    if (error.message.includes('not found')) {
      return errorResponse(res, error.message, null, 404);
    }
    return errorResponse(res, error.message, null, 500);
  }
};

export const storeRatings = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const data = await getRatingsByStore(parseInt(storeId), parseInt(page), parseInt(limit));

    return paginatedResponse(res, data.ratings, data.total, page, limit, 'Store ratings retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, null, error.message.includes('not found') ? 404 : 500);
  }
};

export const userRatings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const data = await getRatingsByUser(req.user.userId, parseInt(page), parseInt(limit));

    return paginatedResponse(res, data.ratings, data.total, page, limit, 'User ratings retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, null, 500);
  }
};

export const checkUserRating = async (req, res) => {
  try {
    const { storeId } = req.params;

    const rating = await getUserRatingForStore(req.user.userId, parseInt(storeId));

    if (!rating) {
      return successResponse(res, null, 'No rating found for this store', 200);
    }

    return successResponse(res, rating, 'User rating retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, null, 500);
  }
};

export const storeStatistics = async (req, res) => {
  try {
    const { storeId } = req.params;
    const stats = await getStoreStats(parseInt(storeId));
    return successResponse(res, stats, 'Store statistics retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, null, 500);
  }
};
