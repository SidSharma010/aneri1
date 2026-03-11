# TravelParcel MVP

Peer-to-peer parcel delivery marketplace for India where senders post parcels and route-matching travelers deliver them for rewards.

## Monorepo structure

- `frontend/` React Native (Expo) app scaffold with core screens.
- `backend/` Node.js + Express API scaffold with auth, trips, delivery requests, and matching.
- `database/schema.sql` PostgreSQL schema for MVP entities.
- `docs/mvp-plan.md` architecture, roadmap, API and scaling plan.

## Quick start

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Database

```bash
psql "$DATABASE_URL" -f database/schema.sql
```

## Core code snippets

### Matching engine (route heuristic)

```js
score += Math.max(0, 40 - pickupDistanceKm);
score += Math.max(0, 40 - dropDistanceKm);
if (trip.capacity_kg >= request.weight_kg) score += 10;
```

### Create delivery request API

```http
POST /api/v1/delivery-requests
Authorization: Bearer <token>
Content-Type: application/json
```

### Escrow flow (MVP)

1. Sender pays through Razorpay/Stripe/UPI.
2. Payment status set to `escrow_held`.
3. Receiver confirms delivery OTP.
4. Platform releases payment to traveler wallet.

## Suggested production stack

- Mobile: React Native + Expo
- API: Node.js + Express
- DB: PostgreSQL (RDS)
- Auth: Firebase OTP + JWT
- Payments: Razorpay + Stripe
- Maps: Google Maps API
- Infra: AWS ECS + CloudFront + S3 + CloudWatch
