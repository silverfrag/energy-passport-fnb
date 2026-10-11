-- ============================================================
-- Seed Data — Fame Drink Official Menu
-- Energy Passport Web App
-- ============================================================

-- ---- PRODUCTS (32 món chính thức từ POS Fame Drink) ----

INSERT INTO products (slug, name, category, short_description, description, price, caffeine_mg, active, featured, sort_order)
VALUES
  -- WAKE Category (8 món Cà phê)
  (
    'ca-phe-sot-biscoff',
    'Cà Phê Sốt Biscoff',
    'WAKE',
    'Cà phê đậm đà kết hợp sốt bánh quy Biscoff béo ngậy thơm lừng và vụn bánh giòn rụm.',
    'Cốt cà phê pha máy nguyên chất hòa quyện lớp sốt bánh quy Biscoff caramel béo ngọt thanh, phủ vụn bánh quy Lotus Biscoff giòn tan, mang lại năng lượng hứng khởi tức thì.',
    31000,
    120,
    TRUE,
    TRUE,
    1
  ),
  (
    'ca-phe-kem-deo-buon-me',
    'Cà Phê Kem Dẻo Buôn Mê',
    'WAKE',
    'Cà phê Robusta Buôn Mê nguyên bản phủ lớp kem dẻo mịn béo bùi đặc trưng.',
    'Hạt Robusta vùng Buôn Ma Thuột rang mộc đậm đà kết hợp lớp kem dẻo thủ công sánh mịn, thơm ngậy lưu luyến kéo dài.',
    30000,
    140,
    TRUE,
    TRUE,
    2
  ),
  (
    'ca-phe-sua-tuoi-suong-sao',
    'Cà Phê Sữa Tươi Sương Sáo',
    'WAKE',
    'Cà phê thơm nồng, sữa tươi thanh trùng và thạch sương sáo dai mềm thanh mát.',
    'Sự kết hợp giải nhiệt hoàn hảo giữa vị cà phê nồng nàn, sữa tươi Đà Lạt béo nhẹ và thạch sương sáo thanh lọc cơ thể.',
    30000,
    110,
    TRUE,
    FALSE,
    3
  ),
  (
    'ca-phe-caramel-kem-muoi',
    'Cà Phê Caramel Kem Muối',
    'WAKE',
    'Cà phê đậm vị quyện sốt caramel ngọt đắng và lớp kem muối bồng bềnh.',
    'Tầng kem muối biển béo ngậy cân bằng hoàn hảo vị đắng sâu của cà phê và hương thơm nồng của sốt caramel đun chậm.',
    30000,
    125,
    TRUE,
    TRUE,
    4
  ),
  (
    'ca-phe-cot-dua',
    'Cà Phê Cốt Dừa',
    'WAKE',
    'Cà phê phin truyền thống hòa quyện cốt dừa sánh mịn, thơm bùi béo ngậy.',
    'Cốt dừa Bến Tre xay sánh mịn quyện cùng cà phê thơm nồng nàn, thức uống giải nhiệt giàu năng lượng.',
    30000,
    115,
    TRUE,
    FALSE,
    5
  ),
  (
    'bac-siu',
    'Bạc Sỉu',
    'WAKE',
    'Bạc sỉu 3 tầng kinh điển, ngọt dịu vị sữa hòa chút đắng nhẹ thơm phức.',
    'Tỷ lệ vàng giữa sữa đặc, sữa tươi thanh trùng và cốt cà phê phin đậm đà, nhẹ nhàng đánh thức ngày mới hứng khởi.',
    28000,
    85,
    TRUE,
    FALSE,
    6
  ),
  (
    'ca-phe-sua',
    'Cà Phê Sữa',
    'WAKE',
    'Cà phê sữa đá truyền thống chuẩn gu Việt, đậm vị và thơm béo vừa vặn.',
    'Cà phê Robusta mộc pha phin đậm đặc kết hợp sữa đặc ngọt béo, chuẩn gu sành cà phê Việt Nam truyền thống.',
    25000,
    140,
    TRUE,
    FALSE,
    7
  ),
  (
    'ca-phe-den',
    'Cà Phê Đen',
    'WAKE',
    'Cà phê đen nguyên chất chiết xuất đậm đà, bật tung sự tỉnh táo tức thì.',
    'Robusta Buôn Mê rang đậm nguyên chất, vị đắng sạch thanh lịch và hậu vị đằm sâu giúp bạn nạp năng lượng tỉnh táo tối đa.',
    19000,
    150,
    TRUE,
    FALSE,
    8
  ),

  -- FOCUS Category (8 món Matcha)
  (
    'matcha-caramel',
    'Matcha Caramel',
    'FOCUS',
    'Matcha cao cấp sánh quyện cùng sốt caramel thơm lừng ngọt êm dịu.',
    'Bột matcha thượng hạng kết hợp sốt caramel ngọt ấm dịu, giàu L-theanine tự nhiên hỗ trợ tập trung bền bỉ suốt buổi làm việc.',
    38000,
    65,
    TRUE,
    FALSE,
    9
  ),
  (
    'matcha-dua-non',
    'Matcha Dừa Non',
    'FOCUS',
    'Vị chát thanh của matcha kết hợp nước dừa tươi và cùi dừa non giòn bùi.',
    'Nước dừa tươi xiêm thanh khiết phối cùng matcha đánh nhuyễn và topping dừa non tươi mềm sần sật thanh mát.',
    37000,
    60,
    TRUE,
    TRUE,
    10
  ),
  (
    'matcha-cookie-kem-deo',
    'Matcha Cookie Kem Dẻo',
    'FOCUS',
    'Matcha cao cấp kết hợp vụn bánh quy giòn tan và lớp kem dẻo đặc quánh béo ngậy.',
    'Cực phẩm matcha với lớp kem dẻo mịn béo bùi, rắc vụn bánh cookie giòn thơm ngon khó cưỡng, giúp giải tỏa áp lực tức thì.',
    45000,
    70,
    TRUE,
    TRUE,
    11
  ),
  (
    'matcha-xoai-sua',
    'Matcha Xoài Sữa',
    'FOCUS',
    'Đột phá vị giác với mứt xoài chín vàng, sữa tươi béo nhẹ và matcha phân tầng.',
    'Tầng sốt xoài cát chín thơm lừng bên dưới, sữa tươi thanh trùng và lớp cốt matcha xanh ngắt mát lạnh tạo nên trải nghiệm đa tầng.',
    45000,
    60,
    TRUE,
    FALSE,
    12
  ),
  (
    'matcha-dau-sua',
    'Matcha Dâu Sữa',
    'FOCUS',
    'Tầng dâu tây đỏ mọng chua ngọt kết hợp sữa tươi và cốt matcha đậm vị.',
    'Mứt dâu tây Đà Lạt tươi thơm dẻo, sữa tươi mềm mượt và lớp matcha thượng hạng tạo nên ly nước phân tầng tuyệt đẹp và tươi mới.',
    45000,
    60,
    TRUE,
    FALSE,
    13
  ),
  (
    'matcha-coldwhisk',
    'Matcha Coldwhisk',
    'FOCUS',
    'Kỹ thuật cold-whisk lạnh tạo bọt foam matcha dày mịn, thanh khiết nguyên bản.',
    'Được đánh chổi lạnh chuyên nghiệp để giữ trọn vẹn diệp lục và hương umami thanh tao của matcha nguyên bản.',
    45000,
    75,
    TRUE,
    TRUE,
    14
  ),
  (
    'coco-matcha',
    'Coco Matcha',
    'FOCUS',
    'Matcha nguyên bản phối hợp cốt dừa thơm béo, đậm đà thanh tao.',
    'Sự kết hợp hoàn hảo giữa cốt dừa tươi thơm bùi và matcha đậm vị, giải tỏa căng thẳng và duy trì sự tập trung dài lâu.',
    40000,
    65,
    TRUE,
    TRUE,
    15
  ),
  (
    'matcha-latte',
    'Matcha Latte',
    'FOCUS',
    'Matcha đánh bông kết hợp sữa tươi thanh trùng, cân bằng vị chát nhẹ và béo thơm.',
    'Thức uống kinh điển mang trọn vẹn tinh thần Nhật Bản, êm ái cho trí não và duy trì năng lượng làm việc bền vững.',
    37000,
    65,
    TRUE,
    FALSE,
    16
  ),

  -- REFRESH Category (16 món Trà Trái Cây)
  (
    'tra-buoi',
    'Trà Bưởi',
    'REFRESH',
    'Tép bưởi hồng tươi mọng nước trên nền trà thanh tao, giàu vitamin C.',
    'Từng tép bưởi hồng tươi căng mọng kết hợp trà lài ủ lạnh, thơm ngát thanh nhiệt và làm đẹp làn da.',
    40000,
    25,
    TRUE,
    TRUE,
    17
  ),
  (
    'tra-cam-quyt',
    'Trà Cam Quýt',
    'REFRESH',
    'Hương cam vàng và quýt ngọt thơm lừng, chua ngọt hài hòa sảng khoái.',
    'Cam vàng mọng nước kết hợp nước cốt quýt tự nhiên và trà hoa vàng, bùng nổ vị giác tức thì.',
    40000,
    25,
    TRUE,
    FALSE,
    18
  ),
  (
    'tra-vai-hoa-hong',
    'Trà Vải Hoa Hồng',
    'REFRESH',
    'Trái vải ngọt mọng ngâm cùng siro hoa hồng dịu dàng quý phái.',
    'Vải thiều mọng nước giòn ngọt kết hợp cánh hoa hồng hữu cơ thơm ngát, đem lại cảm giác thư thái quý phái.',
    40000,
    20,
    TRUE,
    TRUE,
    19
  ),
  (
    'tra-luu-do-habicus',
    'Trà Lựu Đỏ Habicus',
    'REFRESH',
    'Hạt lựu đỏ ruby kết hợp hoa Hibiscus chua dịu, sắc đỏ quyến rũ.',
    'Chiết xuất đài hoa Hibiscus đỏ thắm phối hạt lựu tươi giòn ngọt, giàu chất chống oxy hóa tự nhiên.',
    40000,
    15,
    TRUE,
    FALSE,
    20
  ),
  (
    'tra-chanh-day-nhiet-doi',
    'Trà Chanh Dây Nhiệt Đới',
    'REFRESH',
    'Chanh dây tươi chua thanh kết hợp nền trà hoa, bùng nổ năng lượng nhiệt đới.',
    'Vị chua ngọt kích thích của chanh dây tươi phối nền trà hoa nhài thanh khiết mát lạnh.',
    40000,
    25,
    TRUE,
    FALSE,
    21
  ),
  (
    'tra-dua-luoi',
    'Trà Dưa Lưới',
    'REFRESH',
    'Dưa lưới xanh ngọt ngào thanh khiết, ngát hương giải nhiệt tức thì.',
    'Hương thơm ngọt dịu đặc trưng của dưa lưới tươi kết hợp trà thanh nhẹ xua tan mệt mỏi.',
    40000,
    20,
    TRUE,
    FALSE,
    22
  ),
  (
    'tra-dao-cam-sa',
    'Trà Đào Cam Sả',
    'REFRESH',
    'Đào giòn thơm ngậy, cam tươi mọng nước quyện tinh dầu sả ấm nồng kinh điển.',
    'Miếng đào vàng giòn ngọt ngào kết hợp cam tươi và sả chanh thanh lọc, thức uống yêu thích mọi thời điểm.',
    40000,
    30,
    TRUE,
    TRUE,
    23
  ),
  (
    'tra-tac',
    'Trà Tắc',
    'REFRESH',
    'Trà tắc truyền thống vị chua thanh mát, ngọt dịu giải khát cực đã.',
    'Quả tắc tươi vắt mộc trên nền trà đen đậm đà, vị chua thanh ngọt hậu đánh bay cơn khát với giá siêu tiết kiệm.',
    21000,
    20,
    TRUE,
    FALSE,
    24
  ),
  (
    'tra-mang-cau-tuoi',
    'Trà Mãng Cầu Tươi',
    'REFRESH',
    'Thịt mãng cầu xiêm tươi xé sợi dai giòn, chua ngọt đậm đà cuốn hút.',
    'Mãng cầu xiêm tuyển chọn tươi xé sợi ướp đường phèn, hòa cùng trà lài mát lạnh sần sật đã miệng.',
    40000,
    25,
    TRUE,
    TRUE,
    25
  ),
  (
    'tra-chanh-day-chom-chom',
    'Trà Chanh Dây Chôm Chôm',
    'REFRESH',
    'Cặp đôi chanh dây chua thanh và chôm chôm ngọt giòn sần sật độc đáo.',
    'Trái chôm chôm giòn ngọt kết hợp sốt chanh dây tươi chua thanh mát, kích thích mọi giác quan.',
    40000,
    25,
    TRUE,
    FALSE,
    26
  ),
  (
    'tra-dao-luu-do',
    'Trà Đào Lựu Đỏ',
    'REFRESH',
    'Đào miếng giòn thơm phối cùng nước ép lựu đỏ ruby thơm ngọt quyến rũ.',
    'Vị ngọt thanh tao của miếng đào giòn ngâm phối cùng nước ép lựu đỏ đậm đà, giải nhiệt và làm mới tinh thần.',
    40000,
    25,
    TRUE,
    FALSE,
    27
  ),
  (
    'tra-xoai-yakult',
    'Trà Xoài Yakult',
    'REFRESH',
    'Mứt xoài tươi ngọt dịu kết hợp sữa chua men sống Yakult bổ dưỡng sảng khoái.',
    'Sữa chua men sống Yakult phối cùng mứt xoài chín ngọt thơm, tạo vị chua béo thanh mát tốt cho tiêu hóa.',
    40000,
    NULL,
    TRUE,
    TRUE,
    28
  ),
  (
    'tra-me',
    'Trà Me',
    'REFRESH',
    'Vị me rim chua ngọt đậm đà tuổi thơ, thơm mát đá tuyết giải khát.',
    'Me rim chua ngọt đậm đà, thêm chút đậu phộng rang giòn thơm bùi và đá tuyết mát lạnh sảng khoái.',
    40000,
    20,
    TRUE,
    FALSE,
    29
  ),
  (
    'tra-dau',
    'Trà Dâu',
    'REFRESH',
    'Dâu tây tươi đỏ mọng ngâm đường phèn, hương thơm ngọt lịm kích thích.',
    'Dâu tây đỏ mọng nấu ngào đường phèn, giữ trọn thịt quả giòn dai và hương thơm ngọt ngào tự nhiên.',
    40000,
    25,
    TRUE,
    FALSE,
    30
  ),
  (
    'tra-viet-quat',
    'Trà Việt Quất',
    'REFRESH',
    'Việt quất mọng giàu dinh dưỡng, vị chua ngọt sâu lắng và màu tím quyến rũ.',
    'Trái việt quất nhập khẩu nghiền mọng nước, hòa cùng cốt trà lài thanh khiết, chống oxy hóa và bồi dưỡng sức sống.',
    40000,
    20,
    TRUE,
    FALSE,
    31
  ),
  (
    'tra-dua-hau-oi-hong',
    'Trà Dưa Hấu Ổi Hồng',
    'REFRESH',
    'Hòa quyện đỉnh cao giữa dưa hấu mát ngọt và ổi xá lị hồng thơm nồng nàn.',
    'Nước ép dưa hấu tươi mát hòa quyện sốt ổi xá lị hồng thơm ngát, tạo nên siêu phẩm trà trái cây giải nhiệt mùa hè.',
    40000,
    20,
    TRUE,
    TRUE,
    32
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
