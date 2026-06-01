import express from 'express';
import {
  createProject,
  getMyProjects,
  getProjectById,
  deleteProject
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/projects')
  .post(protect, createProject)
  .get(protect, getMyProjects);

router.route('/projects/:id')
  .get(protect, getProjectById)
  .delete(protect, deleteProject);

export default router;
