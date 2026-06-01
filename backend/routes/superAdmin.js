import express from 'express';
import { updateUserRole, getSuperAdminStats } from '../controllers/superAdminController.js';
import { protect, superAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/superadmin/stats', protect, superAdminOnly, getSuperAdminStats);


router.put('/superadmin/users/:id/role', protect, superAdminOnly, updateUserRole);

export default router;
