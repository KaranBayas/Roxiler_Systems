import express from 'express';
import {
  submitRating,
  editRating,
  removeRating,
  storeRatings,
  userRatings,
  checkUserRating,
  storeStatistics,
} from '../controllers/ratingController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/store/:storeId', storeRatings);
router.get('/store/:storeId/stats', storeStatistics);

// User authenticated routes
router.post('/', authenticateToken, authorizeRole('USER', 'STORE_OWNER'), submitRating);
router.put('/:ratingId', authenticateToken, authorizeRole('USER', 'STORE_OWNER'), editRating);
router.delete('/:ratingId', authenticateToken, authorizeRole('USER', 'STORE_OWNER'), removeRating);
router.get('/user/my-ratings', authenticateToken, userRatings);
router.get('/check/:storeId', authenticateToken, checkUserRating);

export default router;
