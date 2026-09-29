-- ============================================================
-- Seed Data — DEMO content only
-- Energy Passport Web App
-- ============================================================
-- NOTE: All product names, caffeine values, and descriptions
-- are DEMO data. Replace with real brand content before launch.
-- ============================================================

-- ---- PRODUCTS ----

-- WAKE Category
INSERT INTO products (slug, name, category, short_description, description, price, caffeine_mg, active, featured, sort_order)
VALUES
  (
    'wake-americano',
    'Americano [DEMO]',
    'WAKE',
    'Cà phê đen đậm đà, khởi động ngay lập tức.',
    'Americano cổ điển với espresso double shot pha cùng nước nóng vừa. Vị đắng sạch, hậu vị ngọt nhẹ. Lý tưởng để bắt đầu ngày mới hoặc khi cần bật dậy giữa buổi chiều mệt mỏi.',
    45000,
    120,
    TRUE,
    TRUE,
    1
  ),
  (
    'wake-cold-brew',
    'Cold Brew [DEMO]',
    'WAKE',
    'Cold brew ủ lạnh 12 giờ, vị ngọt tự nhiên.',
    'Cold brew được ủ trong 12–18 giờ ở nhiệt độ lạnh. Hàm lượng caffeine cao hơn cà phê thông thường, vị dịu hơn nhờ phương pháp chiết lạnh. Không đắng, uống được ngay.',
    55000,
    150,
    TRUE,
    FALSE,
    2
  ),

-- FOCUS Category
  (
    'focus-matcha-latte',
    'Matcha Latte [DEMO]',
    'FOCUS',
    'Matcha ceremonial grade, sữa oat mềm mại.',
    'Matcha ceremonial grade từ Nhật Bản, pha cùng sữa oat tạo độ béo vừa phải. Caffeine từ matcha hấp thụ chậm hơn cà phê, giúp duy trì sự tập trung lâu dài mà không bị "tụt" đột ngột.',
    65000,
    70,
    TRUE,
    TRUE,
    1
  ),
  (
    'focus-matcha-espresso',
    'Matcha Espresso Fusion [DEMO]',
    'FOCUS',
    'Kết hợp matcha và espresso — tập trung tối đa.',
    'Sự kết hợp độc đáo giữa matcha ceremonial grade và espresso single shot. Hai nguồn caffeine bổ trợ nhau: espresso cho sự tỉnh táo ngay lập tức, L-theanine từ matcha giữ bạn bình tĩnh và tập trung.',
    70000,
    110,
    TRUE,
    FALSE,
    2
  ),

-- REFRESH Category
  (
    'refresh-peach-tea',
    'Peach Oolong Tea [DEMO]',
    'REFRESH',
    'Trà oolong đào, nhẹ nhàng, thơm mát.',
    'Trà oolong được ủ nguội kết hợp với nước đào tươi. Vị chua ngọt cân bằng, không quá ngọt. Caffeine thấp, phù hợp khi bạn muốn thư giãn nhưng vẫn cần chút sự tỉnh táo.',
    50000,
    30,
    TRUE,
    TRUE,
    1
  ),
  (
    'refresh-lychee-mint',
    'Lychee Mint Soda [DEMO]',
    'REFRESH',
    'Vải thiều và bạc hà — sảng khoái tức thì.',
    'Nước vải thiều ép tươi kết hợp lá bạc hà và soda tự nhiên. Không caffeine, lý tưởng cho buổi chiều hoặc khi bạn muốn làm mới hoàn toàn mà không cần chất kích thích.',
    45000,
    NULL,
    TRUE,
    FALSE,
    2
  );

-- ---- MICRO ACTIONS ----

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
  );
