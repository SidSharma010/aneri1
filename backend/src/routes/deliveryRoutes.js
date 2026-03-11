import express from 'express';
import {
  createDeliveryRequest,
  findMatches
} from '../controllers/deliveryController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, createDeliveryRequest);
router.get('/:requestId/matches', requireAuth, findMatches);

export default router;
