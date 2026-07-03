import express from 'express';
import { listUsers, removeUser, addUser } from '../controllers/userController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and ADMIN role
router.use(authenticateToken, authorizeRole('ADMIN'));

router.get('/', listUsers);
router.post('/', addUser);
router.delete('/:userId', removeUser);

export default router;
