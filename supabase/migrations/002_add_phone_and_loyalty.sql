-- ============================================================
-- 002: ADD PHONE NUMBER & LOYALTY TO PROFILES
-- ============================================================

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS loyalty_drinks_claimed INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_profiles_phone_number ON profiles (phone_number);

-- Update RLS so users can update their own phone number
DROP POLICY IF EXISTS "profiles: self update" ON profiles;
CREATE POLICY "profiles: self update"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users and service role to view profiles for barista recognition
DROP POLICY IF EXISTS "profiles: admin and barista read" ON profiles;
CREATE POLICY "profiles: admin and barista read"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id
    OR EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );
