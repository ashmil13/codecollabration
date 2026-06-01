import express from 'express';
import { 
  addProjectVersion, 
  updateProjectVersion, 
  deleteProjectVersion 
} from '../controllers/versionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/projects/:id/versions')
  .post(protect, addProjectVersion);

router.route('/projects/:id/versions/:versionNumber')
  .put(protect, updateProjectVersion)
  .delete(protect, deleteProjectVersion);

export default router;
