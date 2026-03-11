import express from 'express';
import { createTrip } from '../controllers/tripController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, requireRole('traveler'), createTrip);

export default router;
