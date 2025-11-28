import { Router } from 'express';
import { 
  getProfile, 
  updateProfile, 
  updateAccessibilitySettings, 
  getDashboard 
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/accessibility-settings', authenticate, updateAccessibilitySettings);
router.get('/dashboard', authenticate, getDashboard);

export default router;