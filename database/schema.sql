CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('sender', 'traveler', 'receiver', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE request_status AS ENUM ('open', 'matched', 'picked_up', 'in_transit', 'delivered', 'cancelled', 'disputed');
CREATE TYPE trip_status AS ENUM ('open', 'full', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('initiated', 'escrow_held', 'released', 'refunded', 'failed');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role user_role NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE,
  phone VARCHAR(20) UNIQUE NOT NULL,
  google_id VARCHAR(120),
  aadhaar_hash TEXT,
  verification verification_status NOT NULL DEFAULT 'pending',
  rating_avg NUMERIC(2,1) NOT NULL DEFAULT 5.0,
  rating_count INT NOT NULL DEFAULT 0,
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  traveler_id UUID NOT NULL REFERENCES users(id),
  origin_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  origin_lat NUMERIC(9,6) NOT NULL,
  origin_lng NUMERIC(9,6) NOT NULL,
  destination_lat NUMERIC(9,6) NOT NULL,
  destination_lng NUMERIC(9,6) NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  capacity_kg NUMERIC(6,2) NOT NULL,
  status trip_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE delivery_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES users(id),
  receiver_name VARCHAR(120) NOT NULL,
  receiver_phone VARCHAR(20) NOT NULL,
  pickup_address TEXT NOT NULL,
  drop_address TEXT NOT NULL,
  pickup_lat NUMERIC(9,6) NOT NULL,
  pickup_lng NUMERIC(9,6) NOT NULL,
  drop_lat NUMERIC(9,6) NOT NULL,
  drop_lng NUMERIC(9,6) NOT NULL,
  description TEXT,
  weight_kg NUMERIC(6,2) NOT NULL,
  category VARCHAR(40) NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  reward_inr NUMERIC(10,2) NOT NULL,
  pickup_by TIMESTAMPTZ NOT NULL,
  otp_pickup VARCHAR(6),
  otp_delivery VARCHAR(6),
  traveler_id UUID REFERENCES users(id),
  trip_id UUID REFERENCES trips(id),
  status request_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES delivery_requests(id),
  sender_id UUID NOT NULL REFERENCES users(id),
  traveler_id UUID REFERENCES users(id),
  provider VARCHAR(40) NOT NULL,
  provider_payment_id VARCHAR(120),
  amount_inr NUMERIC(10,2) NOT NULL,
  platform_fee_inr NUMERIC(10,2) NOT NULL DEFAULT 0,
  status payment_status NOT NULL,
  escrow_held_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES delivery_requests(id),
  from_user_id UUID NOT NULL REFERENCES users(id),
  to_user_id UUID NOT NULL REFERENCES users(id),
  stars SMALLINT NOT NULL CHECK (stars >= 1 AND stars <= 5),
  review TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (request_id, from_user_id, to_user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES delivery_requests(id),
  sender_id UUID NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(120) NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reported_user_id UUID NOT NULL REFERENCES users(id),
  reporter_user_id UUID NOT NULL REFERENCES users(id),
  reason TEXT NOT NULL,
  severity SMALLINT NOT NULL DEFAULT 1,
  status VARCHAR(30) NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trips_route ON trips (origin_lat, origin_lng, destination_lat, destination_lng);
CREATE INDEX idx_requests_status ON delivery_requests (status, pickup_by);
CREATE INDEX idx_messages_request ON messages (request_id, created_at);
