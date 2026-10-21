# Fame Drink — giao diện và mua hàng / v11

Cập nhật 20/10/2026. Website thật tại http://127.0.0.1:3014 là bản review hiện tại. Home đã chốt theo người dùng; giữ bố cục hero, bốn nền riêng theo vị và cuộn trên ly. Lịch sử quyết định v6–v10 được giữ trong `ui-redesign-v10.md`; các bản v4/v5 có tài liệu riêng.

## Size và giá demo

Giá catalog hiện tại là **M** theo xác nhận người dùng. Người dùng cho phép tự điều chỉnh S/L: S = M − 5.000đ; L = M + 5.000đ. Ví dụ món M 30.000đ có S 25.000đ và L 35.000đ. Size mặc định M. Không thêm dung tích ml hoặc công thức chưa được cung cấp.

`getSizePrice` là quy tắc chung cho UI/server, giữ giá dương (S tối thiểu 1.000đ), từ chối giá không hợp lệ hoặc trên giới hạn 10 triệu. Món inactive/null-price tiếp tục không nhận đặt. Chưa có bảng giá riêng cho từng size trong admin; khi đổi giá M, S/L được suy ra theo chính sách demo này.

Selector radio S/M/L có trên toàn bộ card sản phẩm, menu nổi bật và detail. Giá đổi ngay theo lựa chọn; thông báo thêm giỏ ghi rõ size. Giỏ dùng khóa món+size, nên cùng một món S/M/L là ba dòng riêng. Tăng/giảm/xóa chỉ tác động đúng size; reload giữ lựa chọn. Size được gửi trong payload và hiển thị ở đơn khách hàng/admin.

API chỉ nhận mã món, size và số lượng; server lấy giá M từ catalog đáng tin cậy rồi tự tính giá theo size. Giá/tổng tiền từ trình duyệt không được sử dụng. `items` hiện là JSON trong đơn hàng, vì vậy snapshot size không cần đổi schema DB. Không thay cấu hình nhận đơn, thanh toán hoặc dữ liệu thật.

Giỏ v1, draft cũ và đơn cũ thiếu size được hiểu là M. Request cũ không size được giữ nguyên hình dạng để không thay hash retry/idempotency. Cart mới lưu version 2 dưới key hiện tại; không xóa giỏ cũ.

## Nền menu/detail và ảnh

Toàn bộ **32 món** giờ có ảnh alpha thật: giữ bốn cutout đã duyệt; tách nền 28 JPEG còn lại bằng built-in ImageGen. Bỏ tường/sàn/beige và bóng nền; giữ cốc, lớp đồ uống, đá và topping theo ảnh nguồn. Không dùng CSS blend/mask để giả tách nền. Ảnh gốc không bị ghi đè.

Ảnh mới nằm tại `public/images/campaign/catalog-v11/<slug>.webp`, được trim viền alpha và tối ưu WebP (28 ảnh tổng 3.50 MB). Mapping ở `product-art.ts` chỉ thay ảnh bundled; ảnh upload riêng vẫn được ưu tiên. Manifest `v11-asset-manifest.json` ghi đầu vào, đường dẫn asset, kích thước và dung lượng.

Card catalog và món liên quan dùng nền tối/ánh sáng theo hệ vị espresso, matcha, berry hoặc mango; vòng nét quanh ly nối ngôn ngữ với sân khấu menu. Detail dùng cùng FlavourBackdrop và watermark theo vị. Layout home đã duyệt được giữ; selector size được bổ sung vào card như yêu cầu.

## Mapping component

| Phần | Nguồn |
| --- | --- |
| Loại size, giá chuẩn | `src/lib/constants/product-sizes.ts` |
| Radio size, giá live, thêm giỏ | `src/features/orders/AddToCartButton.tsx` |
| Khóa món+size, migration giỏ, giới hạn | `cart-model.ts`, `CartProvider.tsx`, `checkout-draft.ts` |
| Payload, hiển thị giỏ/đơn khách | `CheckoutClient.tsx`, `OrderStatusClient.tsx` |
| Hiển thị size cho nhân viên | `src/features/admin/orders/OrderDetailClient.tsx` |
| Validate, tính giá tin cậy, snapshot size | `src/lib/orders/validation.ts`, `service.ts`, `types.ts` |
| Ảnh và mapping không ghi đè upload | `src/lib/constants/product-art.ts` |
| Card, menu nổi bật, detail | `ProductCard.tsx`, `ProductShowcase.tsx`, `menu/[slug]/page.tsx` |
| Màu, nét nền, motion | `FlavourBackdrop.tsx`, `storefront-motion.css` |

## Kiểm định

- Production build và lint đạt. Cảnh báo Next middleware→proxy đã có từ trước.
- 25/25 test cart/order-security đạt, gồm legacy cart/draft, size riêng, giá server không tin browser và snapshot vào đơn.
- Playwright: 1920, 1366, 900, 390, 320px; đủ 32 card có S/M/L và alpha art; S/M/L món sương sáo ra đúng 25/30/35k; thêm cả ba vào giỏ, reload, tăng S và xóa M giữ đúng dòng/tổng 85k; không lỗi JavaScript hoặc tràn ngang.
- Kiểm tra giao diện checkout qua transport được intercept: payload có size và không có unitPrice; receipt hiển thị size; xóa đúng món đã đặt. **Không tạo đơn thật.** Server pricing được kiểm tra riêng bằng mock DB trong test, không ghi remote DB.
- Axe trên menu/detail tại 5 kích thước không ghi nhận vi phạm tự động. Sau lần đổi màu card cuối, kiểm tra lại 1920/390/320px: 0 vi phạm và không tràn ngang. Không coi kết quả tự động là audit accessibility thủ công đầy đủ.
- Bản chạy chưa deploy/commit và chưa đồng bộ Figma v11. Quyền/cấu hình nhận đơn thật giữ nguyên.

## Artifact và prompt ảnh

Trong outputs của task: `v11-final-menu-1920.png`, `v11-final-detail-1920.png` và ảnh mobile; `v11-audit.json`, `v11-final-visual-audit.json`, `v11-asset-manifest.json`, `v11-cutouts-contact-sheet.png`.

Mode: **built-in ImageGen**, một edit cho mỗi ảnh. Prompt set dùng cho 28 món: background-extraction; tham chiếu đúng JPEG `/images/drinks/<slug>.jpg`; remove only beige wall, floor and cast floor shadow; preserve exact cup silhouette, drink colour/layers, ice, fruit/toppings, lid/straw if present; complete cup with transparent margin; genuine transparent alpha; no new props/text/branding/checkerboard or recolouring. Không dùng API/CLI fallback. Bản PNG được giữ trong workspace task `cutouts-v11/` hoặc `work/cutouts-v11/`; ảnh WebP dùng thực tế nằm trong repo như trên.
