import express from 'express';
import { loginWithOtp } from '../controllers/authController.js';

const router = express.Router();

router.post('/otp-login', loginWithOtp);

export default router;
