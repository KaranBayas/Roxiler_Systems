import express from 'express';
import {
  listStores,
  getStore,
  addStore,
  editStore,
  removeStore,
  storesStats,
} from '../controllers/storeController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', listStores);
router.get('/stats', storesStats);
router.get('/:storeId', getStore);

// Admin only routes
router.post('/', authenticateToken, authorizeRole('ADMIN'), addStore);
router.put('/:storeId', authenticateToken, authorizeRole('ADMIN'), editStore);
router.delete('/:storeId', authenticateToken, authorizeRole('ADMIN'), removeStore);

export default router;
