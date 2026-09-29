# PRODUCT AUDIT — Energy Passport MVP

**Dự án:** Energy Passport Web App  
**Thời gian audit:** 25/09/2026  
**Trạng thái kiểm thử:** Đã kết nối Supabase Cloud (`gueaewpateybpabcylbt.supabase.co`), đã chạy migration và seed data (6 sản phẩm, 3 micro-actions).

---

## 1. BẢNG KIỂM TRA 17 MỤC TIÊU CHUẨN (PASS / PARTIAL / FAIL)

| # | Tiêu chí đánh giá | Trạng thái | Phân tích chi tiết |
|---|---|:---:|---|
| 1 | Chỉ có landing page tồn tại | **PASS (Đã đạt)** | Đã có đầy đủ các route: `/`, `/check-in`, `/recommendation`, `/menu`, `/menu/[slug]`, `/scan/[slug]`, `/passport`, `/passport/history`, `/auth`, `/admin`. |
| 2 | WAKE/FOCUS/REFRESH chỉ là card trang trí | **PASS (Đã đạt)** | Click card trên Home điều hướng đến `/check-in?state={WAKE\|FOCUS\|REFRESH}` và preselect đúng trạng thái. |
| 3 | Các nút bấm không hoạt động | **PASS (Đã đạt)** | Toàn bộ buttons đều có action (Check-in multi-step, Timer đếm ngược, Xác nhận tiêu thụ, lọc menu, chuyển trang). |
| 4 | Recommendation không có logic thật | **PASS (Đã đạt)** | Đã triển khai engine tất định tại `src/lib/recommendation/engine.ts` (không dùng AI, mapping dựa trên `desiredState` và `fatigueLevel`). |
| 5 | Route QR không tồn tại | **PASS (Đã đạt)** | Route `/scan/[slug]` hoạt động với dynamic slug, kiểm tra sản phẩm active/inactive từ database. |
| 6 | Passport là UI mock | **PARTIAL (Cần bật cấu hình)** | Đã viết query đọc dữ liệu thật từ bảng `consumption_logs`, nhưng đang bị chặn ghi do cài đặt Anonymous Auth của Supabase bị tắt (xem mục 3 bên dưới). |
| 7 | Data chỉ là local static arrays | **PASS (Đã đạt)** | Dữ liệu sản phẩm và micro-actions được nạp trực tiếp từ PostgreSQL Supabase (6 products, 3 micro-actions). MOCK chỉ là fallback phòng ngừa lỗi mạng. |
| 8 | Guest identity bị thiếu | **PARTIAL** | Code sử dụng `supabase.auth.signInAnonymously()`, tuy nhiên Supabase Cloud Project mặc định đang tắt toggle "Allow anonymous sign-ins". Cần bật toggle này trong Supabase Dashboard. |
| 9 | Bắt đăng ký tài khoản quá sớm | **PASS (Đã đạt)** | Flow hoàn toàn guest-first. Người dùng check-in, xem gợi ý, scan QR và xem Passport mà không bị chặn bởi form đăng nhập. |
| 10 | Lịch sử không lưu bền vững | **PARTIAL** | Phụ thuộc vào việc bật Anonymous Sign-ins trên Supabase để session guest lưu bền vững qua cookie. |
| 11 | Không có bảng Supabase thật | **PASS (Đã đạt)** | Database đã có 5 bảng: `products`, `micro_actions`, `consumption_logs`, `state_checkins`, `recommendation_events` kèm RLS policies. |
| 12 | Sản phẩm bị hardcode | **PASS (Đã đạt)** | Sản phẩm được query động từ bảng `products`. |
| 13 | Admin không cập nhật được dữ liệu public | **PASS (Đã đạt)** | Admin CRUD (`/admin/products`, `/admin/actions`) cập nhật trực tiếp vào Supabase, menu public phản ánh ngay lập tức. |
| 14 | Lịch sử caffeine bị tính toán lại sai khi giá trị sản phẩm đổi | **PASS (Đã đạt)** | Khi ghi nhận tiêu thụ, `caffeine_mg_snapshot` được chụp và lưu cố định (immutable) tại thời điểm uống, không bị ảnh hưởng nếu admin sửa caffeine sản phẩm sau đó. |
| 15 | Mua hàng tự động tính là đã uống | **PASS (Đã đạt)** | Scan QR chỉ hiển thị thông tin sản phẩm. Phải nhấn "Xác nhận — Lưu vào Passport" thì mới ghi nhận (Purchase ≠ Consumption). |
| 16 | Trải nghiệm trên mobile kém | **PASS (Đã đạt)** | Thiết kế mobile-first (max-w-sm, max-w-md), tap target chuẩn >= 44px, nút bấm lớn, typography rõ ràng. |
| 17 | Energy Passport bị đặt làm sản phẩm chính thay vì đồ uống | **PASS (Đã đạt)** | Đồ uống là sản phẩm cốt lõi. Hero tập trung vào nhu cầu WAKE/FOCUS/REFRESH của khách hàng. |
| 18 | Giao diện trông như dashboard SaaS / phòng khám | **PASS (Đã đạt)** | Tone màu ấm áp (cam ấm WAKE, xanh matcha FOCUS, xanh mát REFRESH), phong cách lifestyle beverage hiện đại. |

---

## 2. NGUYÊN NHÂN TẠI SAO NGƯỜI DÙNG CẢM THẤY WEB "CHƯA HOẠT ĐỘNG HIỆU QUẢ"

Qua việc audit chi tiết codebase và môi trường chạy thực tế, chúng tôi phát hiện **3 nguyên nhân gốc rễ** khiến web bị gián đoạn:

### Nguyên nhân 1: Lỗi chính tả trong file `.env.local` (ĐÃ KHẮC PHỤC)
- URL ban đầu: `https://guaaewpateybpabcylbt.supabase.co` (bị gõ nhầm chữ `a` thay vì `e`).
- URL chuẩn từ JWT token: `https://gueaewpateybpabcylbt.supabase.co`.
- **Hậu quả:** Toàn bộ API gọi Supabase trước đó đều bị lỗi DNS `ENOTFOUND`, khiến web tự động rơi về Mock Data và không lưu được dữ liệu vào DB.
- **Hiện trạng:** Đã sửa file `.env.local` và kiểm tra kết nối REST thành công lấy được 6 sản phẩm từ Supabase.

### Nguyên nhân 2: Supabase Anonymous Sign-ins đang bị tắt trên Supabase Cloud
- Khi gọi `supabase.auth.signInAnonymously()`, Supabase trả về lỗi:  
  `Anonymous sign-ins are disabled`.
- **Hậu quả:** Khách vãng lai khi scan QR và bấm "Xác nhận — Lưu vào Passport" bị báo lỗi *"Không thể xác thực. Vui lòng thử lại."* và không tạo được bản ghi vào bảng `consumption_logs`.
- **Giải pháp:** Cần 1 cú click bật toggle: **Supabase Dashboard → Authentication → Sign In / Providers → Anonymous Sign-ins → BẬT (Enable)**.

### Nguyên nhân 3: Độ lệch giữa UI hiện tại và Product Truth
1. **Trang Check-in (Step 2):** Đang hỏi khách chọn chữ "WAKE / FOCUS / REFRESH". Theo Product Truth, đây là thuật ngữ thương hiệu; khách hàng cần được chọn bằng từ ngữ của họ: *"Tỉnh táo hơn"*, *"Tập trung ổn định"*, *"Thư giãn / Làm mới"*.
2. **Trang Home:** Thiếu 2 section quan trọng theo Product Truth hierarchy:
   - Section **Drinks** (Trưng bày các món tiêu biểu của WAKE, FOCUS, REFRESH ngay trên trang chủ để khách thấy đồ uống là sản phẩm cốt lõi).
   - Section **Micro-action Experience** (Giới thiệu các bài tập 10+ và 25+ đi kèm để khách thấy giá trị cộng thêm khi quét QR).
3. **Cơ chế Claim Account:** Trong `src/features/auth/actions.ts`, hàm `signInWithOtp` đang tạo mới tài khoản thay vì liên kết/nâng cấp (`linkIdentity` hoặc `updateUser`) cho anonymous user hiện tại, có nguy cơ làm mất lịch sử cũ.

---

## 3. DANH SÁCH FILE VÀ COMPONENT: GIỮ vs CẦN SỬA

### Các file/component CHẤT LƯỢNG CAO — GIỮ NGUYÊN:
- `src/lib/recommendation/engine.ts`: Logic tất định rõ ràng, có unit test.
- `supabase/migrations/001_initial_schema.sql` & `002_seed_data.sql`: Schema chuẩn, RLS chặt chẽ, immutable snapshot.
- `src/app/(public)/menu/page.tsx` & `src/components/ProductCard.tsx`: Trưng bày menu theo 3 nhóm WAKE/FOCUS/REFRESH.
- `src/app/admin/*`: Toàn bộ CRUD cho Products và Micro-actions.
- `src/app/(public)/scan/[slug]/page.tsx`: Xử lý slug, inactive check, 404 check chuẩn.

### Các file CẦN CẬP NHẬT HOÀN THIỆN:
1. `src/features/checkin/CheckInForm.tsx`: Đổi text lựa chọn trạng thái theo Customer Vocabulary ("Tỉnh táo hơn", "Tập trung ổn định", "Thư giãn / làm mới").
2. `src/app/(public)/page.tsx`: Thêm 2 section Featured Drinks và Micro-action showcase đúng chuẩn 8 tầng hierarchy.
3. `src/features/scan/actions.ts`: Bổ sung cơ chế fallback guest cookie ID nếu Supabase anonymous sign-in chưa sẵn sàng, đảm bảo nút xác nhận không bao giờ bị nghẽn.
4. `src/features/auth/actions.ts`: Đảm bảo khi người dùng nhập email thì liên kết trực tiếp vào session anonymous hiện tại để giữ trọn vẹn lịch sử.
