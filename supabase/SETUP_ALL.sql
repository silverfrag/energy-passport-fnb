-- ============================================================
-- ENERGY PASSPORT ATELIER — FULL SETUP & SEED
-- Hướng dẫn: Copy toàn bộ nội dung file này và paste vào:
-- Supabase Dashboard -> SQL Editor -> Nhấn "RUN"
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUM & TABLES
DO $$ BEGIN
  CREATE TYPE drink_category AS ENUM ('WAKE', 'FOCUS', 'REFRESH');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url   TEXT,
  phone_number TEXT,
  loyalty_drinks_claimed INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT UNIQUE NOT NULL,
  name              TEXT NOT NULL,
  category          drink_category NOT NULL,
  short_description TEXT,
  description       TEXT,
  price             NUMERIC(10,2),
  caffeine_mg       INTEGER,
  image_url         TEXT,
  active            BOOLEAN NOT NULL DEFAULT TRUE,
  featured          BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS micro_actions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT UNIQUE NOT NULL,
  category         drink_category NOT NULL,
  title            TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  description      TEXT,
  steps            JSONB NOT NULL DEFAULT '[]',
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS state_checkins (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fatigue_level          INTEGER NOT NULL CHECK (fatigue_level BETWEEN 1 AND 5),
  desired_state          drink_category NOT NULL,
  recommended_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  recommended_action_id  UUID REFERENCES micro_actions(id) ON DELETE SET NULL,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consumption_logs (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id           UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  caffeine_mg_snapshot INTEGER,
  source               TEXT NOT NULL DEFAULT 'qr_scan' CHECK (source IN ('qr_scan', 'manual')),
  state_checkin_id     UUID REFERENCES state_checkins(id) ON DELETE SET NULL,
  consumed_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recommendation_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  state_checkin_id UUID REFERENCES state_checkins(id) ON DELETE SET NULL,
  product_id       UUID REFERENCES products(id) ON DELETE SET NULL,
  micro_action_id  UUID REFERENCES micro_actions(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_consumption_logs_user ON consumption_logs(user_id, consumed_at DESC);

-- RLS POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumption_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public read on products & micro_actions
DROP POLICY IF EXISTS "products: public read active" ON products;
CREATE POLICY "products: public read active" ON products FOR SELECT USING (active = TRUE);

DROP POLICY IF EXISTS "micro_actions: public read active" ON micro_actions;
CREATE POLICY "micro_actions: public read active" ON micro_actions FOR SELECT USING (active = TRUE);

-- Users can read & insert their own logs
DROP POLICY IF EXISTS "consumption_logs: own read" ON consumption_logs;
CREATE POLICY "consumption_logs: own read" ON consumption_logs FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "consumption_logs: own insert" ON consumption_logs;
CREATE POLICY "consumption_logs: own insert" ON consumption_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "profiles: own read" ON profiles;
CREATE POLICY "profiles: own read" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles: own insert" ON profiles;
CREATE POLICY "profiles: own insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles: own update" ON profiles;
CREATE POLICY "profiles: own update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. SEED SPECIALTY PRODUCTS
INSERT INTO products (slug, name, category, short_description, description, price, caffeine_mg, image_url, active, featured, sort_order)
VALUES
  (
    'wake-cold-brew',
    'Cold Brew Ủ Lạnh 12H',
    'WAKE',
    'Ủ chậm lạnh 12-16 giờ ở 4°C, ngọt hậu tự nhiên không đường, êm ái cho dạ dày.',
    'Cold brew chiết xuất chậm từ hạt Arabica Cầu Đất ở độ cao 1.600m, mang tầng hương socola đen và hạt phỉ nướng đầm ấm.',
    29000,
    150,
    '/images/drinks/wake-cold-brew.jpg',
    TRUE,
    TRUE,
    1
  ),
  (
    'wake-americano',
    'Americano Double Shot',
    'WAKE',
    'Espresso Arabica Cầu Đất nguyên chất, vị đắng sạch thanh lịch, đánh thức tức thì.',
    'Americano chế tác từ double shot espresso Arabica thượng hạng pha cùng nước khoáng tinh khiết ở nhiệt độ chuẩn xác.',
    25000,
    120,
    '/images/drinks/wake-cold-brew.jpg',
    TRUE,
    TRUE,
    2
  ),
  (
    'focus-matcha-latte',
    'Matcha Latte Ceremonial',
    'FOCUS',
    'Matcha Uji Kyoto đánh chổi tre thủ công cùng sữa yến mạch béo nhẹ, dồi dào L-theanine.',
    'Bột matcha thượng hạng nhập khẩu trực tiếp từ vùng Uji danh tiếng, kết hợp tỷ lệ L-theanine và caffeine tối ưu cho trạng thái làm việc sâu.',
    35000,
    70,
    '/images/drinks/focus-matcha-latte.jpg',
    TRUE,
    TRUE,
    3
  ),
  (
    'focus-matcha-espresso',
    'Matcha Espresso Layered Dirty',
    'FOCUS',
    'Sự giao thoa giữa vị chát umami thanh tao của matcha và độ nồng đượm của espresso.',
    'Kỹ thuật đổ tầng đặc biệt giữa sữa lạnh, cốt matcha đậm đặc và lớp espresso crema bồng bềnh mang lại cú hích tập trung kép.',
    39000,
    110,
    '/images/drinks/focus-matcha-latte.jpg',
    TRUE,
    FALSE,
    4
  ),
  (
    'refresh-peach-tea',
    'Peach Oolong Sparkling Tea',
    'REFRESH',
    'Trà Oolong Tứ Quý ủ lạnh ngâm đào tươi và bọt khoáng sủi sảng khoái.',
    'Lá trà Oolong Mộc Châu thu hái thủ công, ủ lạnh chiết xuất chậm cùng đào mật tươi tạo hương thơm ngọt ngào không gắt.',
    28000,
    30,
    '/images/drinks/refresh-fruit-tea.jpg',
    TRUE,
    TRUE,
    5
  ),
  (
    'refresh-lychee-mint',
    'Lychee Mint Herbal Sparkler',
    'REFRESH',
    'Vải thiều ngọt dịu phối bạc hà tươi the mát và nước khoáng có ga thanh lọc vị giác.',
    'Thức uống hạ nhiệt hoàn hảo không chứa caffeine nồng, giúp xua tan áp lực và tái tạo sự thư thái trọn vẹn.',
    26000,
    NULL,
    '/images/drinks/refresh-fruit-tea.jpg',
    TRUE,
    FALSE,
    6
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  price = EXCLUDED.price,
  caffeine_mg = EXCLUDED.caffeine_mg,
  image_url = EXCLUDED.image_url,
  active = EXCLUDED.active;

-- 3. SEED MICRO ACTIONS
INSERT INTO micro_actions (slug, category, title, duration_minutes, description, steps, active)
VALUES
  (
    'wake-10-power-breathe',
    'WAKE',
    'Power Breathe 10+',
    10,
    'Kỹ thuật thở kích hoạt năng lượng trong 10 phút — dành để bật dậy ngay lập tức.',
    '[
      {"order": 1, "text": "Ngồi thẳng lưng, hai tay đặt trên đùi."},
      {"order": 2, "text": "Hít thật sâu bằng mũi trong 4 giây."},
      {"order": 3, "text": "Nín thở 4 giây."},
      {"order": 4, "text": "Thở ra mạnh bằng miệng trong 4 giây."},
      {"order": 5, "text": "Lặp lại 10 lần. Tăng tốc độ ở lần 8–10."},
      {"order": 6, "text": "Uống một ngụm WAKE và cảm nhận sự thay đổi."}
    ]',
    TRUE
  ),
  (
    'focus-25-deep-work',
    'FOCUS',
    'Deep Work 25+',
    25,
    'Phiên làm việc tập trung 25 phút — loại bỏ phân tâm, vào guồng ngay.',
    '[
      {"order": 1, "text": "Đặt điện thoại xuống, tắt thông báo."},
      {"order": 2, "text": "Viết ra MỘT nhiệm vụ duy nhất bạn sẽ hoàn thành trong 25 phút này."},
      {"order": 3, "text": "Uống một ngụm FOCUS trước khi bắt đầu."},
      {"order": 4, "text": "Bắt đầu timer và làm việc không gián đoạn."},
      {"order": 5, "text": "Khi timer kết thúc, đánh dấu hoàn thành và nghỉ 5 phút."}
    ]',
    TRUE
  ),
  (
    'refresh-5-mindful-sip',
    'REFRESH',
    'Mindful Sip Break',
    5,
    'Nghỉ ngơi có chủ đích trong 5 phút — làm chậm lại và làm mới hoàn toàn.',
    '[
      {"order": 1, "text": "Rời khỏi màn hình, đứng dậy và kéo giãn nhẹ."},
      {"order": 2, "text": "Cầm ly REFRESH trong tay, cảm nhận độ mát."},
      {"order": 3, "text": "Uống từng ngụm chậm, tập trung vào vị và cảm giác."},
      {"order": 4, "text": "Nhìn ra cửa sổ hoặc nhắm mắt 30 giây."},
      {"order": 5, "text": "Hít thở sâu 3 lần và quay lại với tâm thế mới."}
    ]',
    TRUE
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  duration_minutes = EXCLUDED.duration_minutes,
  description = EXCLUDED.description,
  steps = EXCLUDED.steps;
