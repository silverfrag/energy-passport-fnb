-- ============================================================
-- Migration 001: Initial Schema
-- Energy Passport Web App
-- Run this in Supabase SQL Editor or via supabase db push
-- ============================================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TYPE drink_category AS ENUM ('WAKE', 'FOCUS', 'REFRESH');

CREATE TABLE IF NOT EXISTS products (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT        UNIQUE NOT NULL,
  name              TEXT        NOT NULL,
  category          drink_category NOT NULL,
  short_description TEXT,
  description       TEXT,
  price             NUMERIC(10,2),
  caffeine_mg       INTEGER,      -- nullable: some products may not have data
  image_url         TEXT,
  active            BOOLEAN     NOT NULL DEFAULT TRUE,
  featured          BOOLEAN     NOT NULL DEFAULT FALSE,
  sort_order        INTEGER     NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MICRO ACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS micro_actions (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT        UNIQUE NOT NULL,
  category         drink_category NOT NULL,
  title            TEXT        NOT NULL,
  duration_minutes INTEGER     NOT NULL,
  description      TEXT,
  steps            JSONB       NOT NULL DEFAULT '[]',
  active           BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- STATE CHECK-INS
-- ============================================================
CREATE TABLE IF NOT EXISTS state_checkins (
  id                     UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fatigue_level          INTEGER NOT NULL CHECK (fatigue_level BETWEEN 1 AND 5),
  desired_state          drink_category NOT NULL,
  recommended_product_id UUID    REFERENCES products(id) ON DELETE SET NULL,
  recommended_action_id  UUID    REFERENCES micro_actions(id) ON DELETE SET NULL,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CONSUMPTION LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS consumption_logs (
  id                   UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id           UUID    NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  caffeine_mg_snapshot INTEGER,  -- IMMUTABLE snapshot at time of consumption
  source               TEXT    NOT NULL DEFAULT 'qr_scan'
                                CHECK (source IN ('qr_scan', 'manual')),
  state_checkin_id     UUID    REFERENCES state_checkins(id) ON DELETE SET NULL,
  consumed_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- RECOMMENDATION EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS recommendation_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  state_checkin_id UUID REFERENCES state_checkins(id) ON DELETE SET NULL,
  product_id       UUID REFERENCES products(id) ON DELETE SET NULL,
  micro_action_id  UUID REFERENCES micro_actions(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ADMIN USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_state_checkins_user ON state_checkins(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consumption_logs_user ON consumption_logs(user_id, consumed_at DESC);
CREATE INDEX IF NOT EXISTS idx_consumption_logs_recent ON consumption_logs(user_id, product_id, consumed_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_micro_actions_updated_at
  BEFORE UPDATE ON micro_actions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE products            ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_actions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_checkins      ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumption_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users         ENABLE ROW LEVEL SECURITY;

-- ---- PROFILES ----
-- Users can only read/write their own profile
CREATE POLICY "profiles: own read"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: own insert"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles: own update"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ---- PRODUCTS ----
-- Anyone can read active products
CREATE POLICY "products: public read active"
  ON products FOR SELECT
  USING (active = TRUE);

-- Admins can read all (including inactive)
CREATE POLICY "products: admin read all"
  ON products FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "products: admin insert"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "products: admin update"
  ON products FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "products: admin delete"
  ON products FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- ---- MICRO ACTIONS ----
-- Anyone can read active micro_actions
CREATE POLICY "micro_actions: public read active"
  ON micro_actions FOR SELECT
  USING (active = TRUE);

CREATE POLICY "micro_actions: admin read all"
  ON micro_actions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "micro_actions: admin insert"
  ON micro_actions FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "micro_actions: admin update"
  ON micro_actions FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "micro_actions: admin delete"
  ON micro_actions FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- ---- STATE CHECK-INS ----
-- Users read/write only their own check-ins
CREATE POLICY "state_checkins: own read"
  ON state_checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "state_checkins: own insert"
  ON state_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ---- CONSUMPTION LOGS ----
-- Users read/write only their own logs
CREATE POLICY "consumption_logs: own read"
  ON consumption_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "consumption_logs: own insert"
  ON consumption_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ---- RECOMMENDATION EVENTS ----
CREATE POLICY "recommendation_events: own read"
  ON recommendation_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "recommendation_events: own insert"
  ON recommendation_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ---- ADMIN USERS ----
-- Only service_role can manage admin_users.
-- Admins can read their own row to confirm they are admin.
CREATE POLICY "admin_users: self read"
  ON admin_users FOR SELECT
  USING (auth.uid() = user_id);

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
