# TravelParcel MVP Blueprint

## 1) Full Product Architecture

- **Client apps**
  - React Native mobile app for sender/traveler/receiver.
  - React web admin panel (phase-2 for operations team).
- **API layer**
  - Node.js + Express REST API.
  - JWT/Firebase token verification middleware.
- **Core services**
  - Matching service (route overlap scoring).
  - Escrow payment orchestrator (Razorpay/Stripe/UPI).
  - Notification service (FCM + SMS OTP).
  - Trust & safety service (ID verification, restricted categories, reports).
- **Data layer**
  - PostgreSQL primary DB.
  - Redis for short-lived OTP/session/cache (phase-2).
- **Integrations**
  - Maps + geocoding + polyline ETA (Google Maps API).
  - KYC vendor (Digilocker/Signzy equivalent) for Aadhaar checks.

## 2) API Structure (MVP)

- `POST /api/v1/auth/otp-login`
- `POST /api/v1/auth/google-login`
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `POST /api/v1/trips`
- `GET /api/v1/trips/me`
- `POST /api/v1/delivery-requests`
- `GET /api/v1/delivery-requests/:id`
- `GET /api/v1/delivery-requests/:requestId/matches`
- `POST /api/v1/delivery-requests/:id/accept`
- `POST /api/v1/delivery-requests/:id/confirm-pickup`
- `POST /api/v1/delivery-requests/:id/confirm-delivery`
- `POST /api/v1/payments/:requestId/create-intent`
- `POST /api/v1/payments/:requestId/release`
- `GET /api/v1/wallet/summary`
- `POST /api/v1/ratings`
- `GET /api/v1/messages/:requestId`
- `POST /api/v1/messages/:requestId`
- `POST /api/v1/reports`

## 3) UI/UX Screen Structure

1. Login + OTP + Google Sign-in
2. Home Dashboard (role-aware quick actions)
3. Create Delivery Request
4. Available Deliveries (traveler suggestions)
5. Trip Posting
6. Parcel Tracking (map + milestones)
7. Wallet/Earnings + Withdraw
8. Chat Screen
9. Ratings & Reviews

## 4) Development Roadmap

### Sprint 1 (Week 1-2): Foundation
- Auth, user profiles, KYC status.
- DB schema + migrations.
- Delivery request creation.

### Sprint 2 (Week 3-4): Matching + Trips
- Trip posting + matching endpoint.
- Delivery acceptance + status transitions.
- Sender/traveler chat baseline.

### Sprint 3 (Week 5-6): Payments + Tracking
- Escrow payment flow with Razorpay/Stripe.
- Pickup OTP + delivery OTP flow.
- GPS location pings and timeline UI.

### Sprint 4 (Week 7-8): Trust + Admin
- Reporting, fraud flags, restricted categories.
- Admin dashboard for users and requests.
- Ratings and basic recommendation tuning.

## 5) Security and Safety

- Mandatory traveler KYC before accepting any parcel.
- Category blocklist (e.g., prohibited/illegal goods).
- Risk score based on cancellation, disputes, reports, and device signals.
- Escrow-only payment release after receiver OTP confirmation.
- Immutable event log for disputes.

## 6) Scalability Plan

- Split monolith into services: Auth, Matching, Payments, Messaging.
- Move async workflows to queue (SQS/Kafka): notifications, risk checks.
- Introduce geospatial index (PostGIS) for better route matching.
- Add read replicas + analytics warehouse (BigQuery/Redshift).
- Multi-city operational rollout with per-city risk thresholds.

## 7) Deployment Guide

1. Provision PostgreSQL (AWS RDS) and set `DATABASE_URL`.
2. Deploy backend API on AWS ECS/Fargate or Render.
3. Set secrets: `JWT_SECRET`, payment keys, Maps keys.
4. Run `database/schema.sql` in production DB.
5. Deploy mobile app with Expo EAS build profiles.
6. Enable monitoring: CloudWatch + Sentry + uptime checks.
