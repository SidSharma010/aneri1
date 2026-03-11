import { z } from 'zod';
import { pool } from '../config/db.js';
import { scoreTripForRequest } from '../services/matchingService.js';

const createRequestSchema = z.object({
  pickupAddress: z.string().min(5),
  dropAddress: z.string().min(5),
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropLat: z.number(),
  dropLng: z.number(),
  weightKg: z.number().positive(),
  category: z.string(),
  rewardInr: z.number().positive(),
  pickupBy: z.string()
});

export async function createDeliveryRequest(req, res) {
  const parsed = createRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  const q = `
    INSERT INTO delivery_requests
    (sender_id, pickup_address, drop_address, pickup_lat, pickup_lng, drop_lat, drop_lng,
     weight_kg, category, reward_inr, pickup_by, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'open')
    RETURNING *;
  `;

  const values = [
    req.user.id,
    parsed.data.pickupAddress,
    parsed.data.dropAddress,
    parsed.data.pickupLat,
    parsed.data.pickupLng,
    parsed.data.dropLat,
    parsed.data.dropLng,
    parsed.data.weightKg,
    parsed.data.category,
    parsed.data.rewardInr,
    parsed.data.pickupBy
  ];

  const { rows } = await pool.query(q, values);
  return res.status(201).json(rows[0]);
}

export async function findMatches(req, res) {
  const requestId = req.params.requestId;

  const requestResult = await pool.query(
    'SELECT * FROM delivery_requests WHERE id = $1',
    [requestId]
  );

  if (!requestResult.rows.length) {
    return res.status(404).json({ message: 'Request not found' });
  }

  const request = requestResult.rows[0];
  const tripsResult = await pool.query(
    "SELECT * FROM trips WHERE status = 'open' AND departure_time >= NOW()"
  );

  const matches = tripsResult.rows
    .map((trip) => ({ trip, score: scoreTripForRequest(trip, request) }))
    .filter((m) => m.score >= 45)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return res.json({ requestId, matches });
}
