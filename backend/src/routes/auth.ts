import { Router } from 'express';
import { register, login, signup } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/signup', signup);

export default router;