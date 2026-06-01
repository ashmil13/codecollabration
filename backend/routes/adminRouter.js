import express from 'express';
import { getAdminStats, getAllProjects, deleteProjectByAdmin, getAllUsers, deleteUserByAdmin, getAllVersionsByAdmin, deleteVersionByAdmin } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin/stats', protect, adminOnly, getAdminStats);

router.get('/admin/projects', protect, adminOnly, getAllProjects);
router.delete('/admin/projects/:id', protect, adminOnly, deleteProjectByAdmin);

router.get('/admin/users', protect, adminOnly, getAllUsers);
router.delete('/admin/users/:id', protect, adminOnly, deleteUserByAdmin);

router.get('/admin/versions', protect, adminOnly, getAllVersionsByAdmin);
router.delete('/admin/versions/:id', protect, adminOnly, deleteVersionByAdmin);

export default router;
