import { z } from 'zod';
import { pool } from '../config/db.js';

const tripSchema = z.object({
  originAddress: z.string(),
  destinationAddress: z.string(),
  originLat: z.number(),
  originLng: z.number(),
  destinationLat: z.number(),
  destinationLng: z.number(),
  departureTime: z.string(),
  capacityKg: z.number().positive()
});

export async function createTrip(req, res) {
  const parsed = tripSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  const q = `
    INSERT INTO trips
    (traveler_id, origin_address, destination_address, origin_lat, origin_lng,
     destination_lat, destination_lng, departure_time, capacity_kg, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'open')
    RETURNING *;
  `;

  const values = [
    req.user.id,
    parsed.data.originAddress,
    parsed.data.destinationAddress,
    parsed.data.originLat,
    parsed.data.originLng,
    parsed.data.destinationLat,
    parsed.data.destinationLng,
    parsed.data.departureTime,
    parsed.data.capacityKg
  ];

  const { rows } = await pool.query(q, values);
  return res.status(201).json(rows[0]);
}
