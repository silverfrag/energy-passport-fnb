# Đặt món giao hàng và thanh toán chuyển khoản

Bản demo nhận **giao hàng**, phí giao hàng **0đ**. Máy chủ tính tiền từ danh mục của cửa hàng; giá hoặc trạng thái thanh toán gửi từ trình duyệt không được dùng. Chuyển khoản ngân hàng do quản trị viên đối soát thủ công, không có webhook xác nhận tiền hay hoàn tiền tự động.

## Cấu hình máy chủ

- `NEXT_PUBLIC_SUPABASE_URL`: URL dự án Supabase.
- `SUPABASE_SECRET_KEY`: secret key phía máy chủ. Có thể dùng `SUPABASE_SERVICE_ROLE_KEY` nếu dự án dùng khóa legacy; chỉ cần một trong hai.
- `ADMIN_SESSION_SECRET`: chuỗi ngẫu nhiên ít nhất 32 ký tự để ký phiên quản trị và mã truy cập đơn. Giữ ổn định giữa các lần deploy để liên kết đơn còn sử dụng được; thay giá trị sẽ vô hiệu hóa các phiên và mã cũ.
- `ADMIN_PASSKEY`: mật khẩu quản trị ít nhất 12 ký tự, hoặc PIN demo đúng 4 chữ số do chủ quán cấu hình rõ ràng. Không có mật khẩu/PIN mặc định hoặc fallback trong mã nguồn. PIN được giữ dạng chuỗi để không mất số 0 đầu; production nhận đơn thật nên dùng mật khẩu dài.

Hai khóa bí mật và mật khẩu phải lưu trong cấu hình máy chủ, không đặt tên `NEXT_PUBLIC_*`, không commit vào Git. Cấu hình riêng từng môi trường preview/production theo đúng dự án Supabase của môi trường đó.

Chạy migration online orders trong `supabase/migrations/`. Migration tạo `online_orders`, `online_order_events`, `online_payment_settings`, `online_rate_limits`, RPC giới hạn tần suất và trigger lưu lịch sử trạng thái. Các bảng đều bật RLS; `anon` và `authenticated` không được đọc/ghi, chỉ API máy chủ có quyền thao tác. Không cần tạo các bảng Passport cũ để chạy phần đơn hàng.

Nếu bảng `products` chưa tồn tại, API dùng 32 món trong `src/lib/constants/products.ts` trên máy chủ. Khi bảng đã được tạo, API dùng các món đang bán từ bảng đó; bảng rỗng nghĩa là chưa có món nhận đặt. Lỗi mạng/quyền truy cập không âm thầm chuyển sang giá dự phòng. Các thay đổi danh mục từ admin chỉ được báo thành công sau khi lưu được vào cơ sở dữ liệu.

## Mở nhận đơn

1. Vào `/admin/orders`, đăng nhập bằng mật khẩu quản trị đã cấu hình. Cookie quản trị có chữ ký, hết hạn sau 8 giờ; cookie `ep_admin_session=true` cũ không còn quyền truy cập.
2. Mở `/admin/payment-settings`, nhập BIN ngân hàng (6 số), tên ngân hàng, số tài khoản (6–19 số), tên chủ tài khoản. Kiểm tra thông tin chủ tài khoản trong ứng dụng ngân hàng trước khi mở nhận đơn.
3. Bật nhận đơn online và lưu. Mặc định nhận đơn tắt. Khi thiếu cấu hình hoặc cơ sở dữ liệu chưa sẵn sàng, API từ chối tạo đơn và không hiển thị xác nhận thanh toán giả.
4. Thử một đơn kiểm tra trong môi trường test; quét QR để kiểm tra đúng tài khoản, số tiền và nội dung mã đơn. Không cần chuyển tiền để kiểm tra nội dung QR.

QR được dựng cục bộ từ payload chuyển khoản NAPAS/EMVCo, không gửi tài khoản hoặc thông tin khách sang dịch vụ tạo ảnh QR bên ngoài. Mã QR chỉ là hướng dẫn chuyển tiền. Nút **Đã chuyển khoản** của khách chỉ chuyển đơn sang `payment_review`; chỉ quản trị viên kiểm tra sao kê rồi **Xác nhận đã nhận tiền** mới chuyển sang `paid`.

Trạng thái giao hàng: `unconfirmed` → (xác nhận đã nhận tiền) `confirmed` → `preparing` → `out_for_delivery` → `completed`. Có thể hủy đơn chưa thanh toán. Đơn đã nhận tiền cần đối soát/hoàn tiền ngoài hệ thống; API không tự đánh dấu đã hoàn tiền.

## Hợp đồng API

| API | Quyền / nội dung |
| --- | --- |
| `GET /api/orders/config` | Trạng thái nhận đơn, giao hàng miễn phí demo; không trả tài khoản ngân hàng |
| `POST /api/orders` | `CreateOrderInput` với UUIDv4 `idempotencyKey`; trả `{order, accessToken, replayed}` |
| `GET /api/orders/:id` | Header `Authorization: Bearer accessToken`; trả `{order}` |
| `POST /api/orders/:id/payment-review` | Cùng Bearer token; khách báo đã chuyển tiền, không được đánh dấu paid |
| `POST /api/admin/session` | `{passkey}`; tạo cookie ký và giới hạn tần suất đăng nhập |
| `DELETE /api/admin/session` | Xóa phiên quản trị |
| `GET /api/admin/orders?offset=0&limit=30` | Cookie quản trị; `{orders,total,hasMore}` |
| `GET/PATCH /api/admin/orders/:id` | Chi tiết/thao tác quản trị, PATCH luôn cần `version` hiện tại |
| `GET/PUT /api/admin/payment-settings` | GET `{settings}`, PUT nội dung settings có `version` |

Mọi lỗi có dạng `{error, code}`; `409 VERSION_CONFLICT` yêu cầu tải lại trước khi thử lại. Mọi phản hồi đặt món/admin dùng `Cache-Control: no-store, private`. Mã truy cập đơn chỉ lưu dạng hash trong DB, không dùng ID hoặc số điện thoại làm quyền xem đơn. Giữ mã truy cập khỏi analytics, URL query và log.

## Kiểm tra

`node scripts/orders-security.test.cjs` kiểm tra yêu cầu địa chỉ, số lượng/định danh món, bỏ qua giá và trạng thái giả từ client, phí 0, chữ ký/expiry phiên, quyền xác nhận thanh toán, chuyển trạng thái, checksum QR, dữ liệu công khai không chứa secret, chống gửi khác origin, giới hạn body và lỗi 503 khi chưa cấu hình. Đây là kiểm tra logic không dùng mạng. Cần kiểm tra API thực trên môi trường đã áp migration để xác nhận lưu bền vững, RLS, idempotency và hai cập nhật đồng thời; không coi bộ test logic là bằng chứng đã deploy hoặc đã nhận tiền.

Tài liệu cơ sở: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Supabase Data API security](https://supabase.com/docs/guides/api/securing-your-api). Payload QR theo định dạng NAPAS QRIBFTTA; cần kiểm tra nội dung bằng ứng dụng ngân hàng đang sử dụng trước khi mở nhận tiền.
