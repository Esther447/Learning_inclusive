import { Router } from 'express';
import { getCourses, getCourse, createCourse, updateCourse } from '../controllers/courseController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getCourses);
router.get('/:id', authenticate, getCourse);
router.post('/', authenticate, authorize('mentor', 'administrator'), createCourse);
router.put('/:id', authenticate, authorize('mentor', 'administrator'), updateCourse);

export default router;