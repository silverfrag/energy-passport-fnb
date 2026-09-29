# KẾ HOẠCH TRIỂN KHAI HOÀN THIỆN MVP (IMPLEMENTATION PLAN)

Kế hoạch chia thành các lát cắt dọc (Vertical Slices), mỗi bước mang lại tính năng chạy thật end-to-end.

---

## 1. THỨ TỰ THỰC THI CHI TIẾT (PHASES 1 - 9)

### PHASE 1: Cấu hình Môi trường & Danh tính Ẩn danh (Guest Identity)
- [x] **Đã xong:** Sửa lỗi URL chính tả trong `.env.local` (`guaa` -> `guea`), kết nối database thành công.
- [ ] **Cần làm:** Bật toggle **Anonymous Sign-ins** trên Supabase Dashboard.
- [ ] **Cần làm:** Bổ sung fallback xác thực trong `src/features/scan/actions.ts` và `src/lib/supabase/` để guest session luôn trơn tru không bị crash.
- **Tiêu chí nghiệm thu:** Chạy script tạo anonymous user qua Supabase Auth thành công 100%, cookie session lưu được trên trình duyệt.

---

### PHASE 2: Quản lý Menu & Sản phẩm (Products/Menu)
- [x] **Đã xong:** Schema bảng `products` và 6 món ban đầu trong database.
- [x] **Đã xong:** Route `/menu` query trực tiếp từ Supabase và hiển thị theo 3 nhóm WAKE / FOCUS / REFRESH.
- [ ] **Cần làm:** Thêm section Featured Drinks vào trang chủ (`/`) để khách vừa vào web là thấy ngay sản phẩm đồ uống thực tế.
- **Tiêu chí nghiệm thu:** Sửa giá một món trong Supabase, reload trang `/menu` thấy giá mới ngay mà không cần sửa code.

---

### PHASE 3: Check-in Trạng thái & Recommendation Engine
- [x] **Đã xong:** Module tất định `src/lib/recommendation/engine.ts` mapping trạng thái ra đồ uống + micro-action.
- [ ] **Cần làm:** Sửa `src/features/checkin/CheckInForm.tsx`:
  - Đổi text lựa chọn trạng thái sang Customer Vocabulary:
    - *WAKE* -> **"Tỉnh táo hơn"** (Bật dậy ngay, khởi động ngày mới)
    - *FOCUS* -> **"Tập trung ổn định"** (Duy trì tỉnh táo lâu dài, làm việc sâu)
    - *REFRESH* -> **"Thư giãn / Làm mới"** (Hạ nhiệt, giải tỏa căng thẳng)
- [ ] **Cần làm:** Lưu `state_checkins` và `recommendation_events` vào Supabase khi khách hoàn tất check-in.
- **Tiêu chí nghiệm thu:** Mệt mức 4 + muốn tập trung -> Ra đúng món FOCUS Matcha + bài tập Deep Work 25+ kèm lý do giải thích ngắn gọn, không phát ngôn y tế.

---

### PHASE 4: QR Flow & Xác nhận Tiêu thụ (Confirm Consumption)
- [x] **Đã xong:** Route `/scan/[slug]` kiểm tra sản phẩm active/inactive.
- [x] **Đã xong:** Cơ chế chống trùng lặp (duplicate check trong vòng 5 phút).
- [ ] **Cần làm:** Đảm bảo khi bấm "✓ Xác nhận — Lưu vào Passport":
  - Tạo hoặc nhận diện anonymous user hiện tại.
  - Lưu `caffeine_mg_snapshot` cố định vào bảng `consumption_logs`.
  - Thông báo thành công và chuyển mượt về Passport.
- **Tiêu chí nghiệm thu:** Mở `/scan/focus-matcha-latte`, bấm xác nhận -> Trong Supabase có record mới trong `consumption_logs` với `caffeine_mg_snapshot = 70`.

---

### PHASE 5: Energy Passport
- [x] **Đã xong:** Giao diện hiển thị caffeine hôm nay, số ly đã uống, danh sách log gần đây.
- [x] **Đã xong:** Route `/passport/history` xem toàn bộ lịch sử.
- [ ] **Cần làm:** Hoàn thiện câu chữ: "caffeine ước tính", "ly đã ghi nhận", không dùng các từ "liều lượng an toàn" hay y tế.
- **Tiêu chí nghiệm thu:** Refresh trình duyệt, Passport vẫn hiển thị nguyên vẹn các ly đã ghi nhận của anonymous user đó.

---

### PHASE 6: Claim Passport (Liên kết tài khoản vĩnh viễn)
- [ ] **Cần làm:** Cập nhật `src/features/auth/actions.ts`:
  - Khi user ấn "Lưu Energy Passport", gọi phương thức liên kết danh tính (`linkIdentity` hoặc nâng cấp user bằng OTP) của Supabase để **giữ nguyên `user_id` cũ**.
- **Tiêu chí nghiệm thu:** Khách có 2 ly lúc ẩn danh -> Nhập email liên kết -> Sau khi đăng nhập thành công, Passport vẫn thấy đủ 2 ly đó.

---

### PHASE 7: Admin CRUD
- [x] **Đã xong:** Trang `/admin/products` thêm, sửa, bật/tắt, đánh dấu featured sản phẩm.
- [x] **Đã xong:** Trang `/admin/actions` quản lý các bài micro-action 10+, 25+.
- **Tiêu chí nghiệm thu:** Admin đổi thông tin trên giao diện, dữ liệu public ngoài menu cập nhật tức thì.

---

### PHASE 8: Đánh bóng Trang Chủ (Home Polish)
- [ ] **Cần làm:** Bổ sung đầy đủ 8 tầng nội dung theo chuẩn Product Truth:
  1. Hero: Bán trải nghiệm đồ uống ("Bây giờ bạn cần WAKE, FOCUS hay REFRESH?") + CTA "Chọn trạng thái của bạn".
  2. Phân nhóm WAKE / FOCUS / REFRESH.
  3. Cách thức hoạt động 3 bước.
  4. **Drinks Preview** (Trưng bày đồ uống nổi bật).
  5. **Micro-action Experience** (Giới thiệu WAKE 10+, FOCUS 25+, REFRESH break).
  6. Energy Passport (Giải thích ngắn gọn lợi ích).
  7. QR / Tem trên ly.
  8. CTA hành động cuối trang.

---

### PHASE 9: Kiểm thử E2E (5 Kịch bản cốt lõi)
1. **Scenario 1:** Khách mới vào Home -> Check-in mệt 4 + muốn tập trung -> Nhận FOCUS Matcha + bài tập 25+.
2. **Scenario 2:** Khách ẩn danh vào `/scan/focus-matcha-latte` -> Bấm xác nhận -> DB lưu log -> Passport hiển thị món và caffeine.
3. **Scenario 3:** Cùng khách đó scan thêm 1 ly khác -> Passport có 2 bản ghi, cùng 1 user_id.
4. **Scenario 4:** Khách liên kết email -> Passport vẫn giữ nguyên 2 bản ghi cũ.
5. **Scenario 5:** Admin sửa giá đồ uống -> Menu public hiển thị giá mới mà không sửa code.
