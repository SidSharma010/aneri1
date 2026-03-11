import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/authRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import { healthCheckDb } from './config/db.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/health', async (_req, res) => {
  try {
    await healthCheckDb();
    res.json({ status: 'ok' });
  } catch {
    res.status(500).json({ status: 'db_unavailable' });
  }
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/delivery-requests', deliveryRoutes);
app.use('/api/v1/trips', tripRoutes);

export default app;
