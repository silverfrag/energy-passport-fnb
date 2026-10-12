# Fame Drink — Prompt phục dựng ảnh thực đơn

Cập nhật ngày 12/10/2026. Bộ prompt lưu trữ cho 22 ảnh nguồn ban đầu 360×360 bị mờ, vỡ khối và nhiễu trong menu. Dựng ảnh mới bằng công cụ **image_gen tích hợp**, giữ đúng tên file website đang sử dụng. Không phóng lớn ảnh mờ để thay cho việc dựng lại.

**Phạm vi tiếp tục theo xác nhận mới nhất:** chỉ 5 món Trà Đào Lựu Đỏ, Trà Xoài Yakult, Trà Me đá, Trà Dâu và Trà Việt Quất. Khi bắt đầu đợt tiếp tục, 27/32 ảnh menu đã đạt tối thiểu 1024×1024; không tạo lại 27 món đã hoàn tất. Danh sách 22 prompt bên dưới được giữ làm tài liệu tham khảo, không phải danh sách việc còn lại.

**Đã hoàn tất 5/5 món còn lại ngày 12/10/2026.** Cả 5 ảnh mới có kích thước nguyên bản 1254×1254, được tạo bằng image_gen tích hợp và xuất JPEG quality 92, 4:4:4, không upscale. Bộ menu hiện có 32/32 ảnh tối thiểu 1024×1024.

| File đã thay trong `public/images/drinks/` | Kích thước | Kiểm tra |
| --- | --- | --- |
| `tra-dao-luu-do.jpg` | 1254×1254 | Đào vàng, lựu đỏ, trà phân tầng |
| `tra-xoai-yakult.jpg` | 1254×1254 | Xoài vàng, nền sữa lên men, đá |
| `tra-me.jpg` | 1254×1254 | Me nâu hổ phách, đá vụn, đậu phộng |
| `tra-dau.jpg` | 1254×1254 | Trà đỏ, lát/nửa quả dâu, đá |
| `tra-viet-quat.jpg` | 1254×1254 | Trà tím đỏ, quả việt quất, đá |

Đã kiểm tra trực quan file ảnh; 5 URL ảnh và 5 trang chi tiết local đều trả HTTP 200, nội dung ảnh trả về khớp file mới. Báo cáo local nằm tại `output/imagegen/drink-menu-2026-10-11/remaining-five-verification.json`. Khung thẻ món và ảnh chi tiết đã chuyển sang tỉ lệ vuông để giữ trọn ly. ESLint hai file hiển thị không có lỗi, còn 4 cảnh báo import chưa sử dụng có từ trước. Build production đã thành công. Chưa kiểm tra ảnh chụp giao diện vì không có trình duyệt kết nối.

Website chính thức: `https://energy-passport-fnb.vercel.app`. Vercel tự động triển khai từ nhánh `main` của `silverfrag/energy-passport-fnb`; sau khi đẩy cập nhật, cần xác nhận trạng thái Vercel thành công và đối chiếu 5 ảnh production với file JPEG đã duyệt. Thư mục `output/` chứa bản gốc, sao lưu và báo cáo nội bộ trên máy, không cần đưa lên hosting.

## 1. Kết quả kiểm tra và quy chuẩn

- 22 tên file bên dưới khớp `src/lib/constants/drink-assets.ts`; tại lần kiểm tra ban đầu, 10 món khác đã có ảnh 1024×1024.
- Prompt cũ thiếu quy định nhất quán về góc máy, khoảng trống quanh ly và độ nét; câu “dome or flat lid” cũng không khớp các ảnh đã duyệt dùng ly mở miệng. Bộ mới thống nhất ly mở, không nắp, không ống hút để thấy rõ đá và topping.
- Giữ nền be ấm, bóng cửa sổ nhẹ, ly nhựa trong không logo, không chữ, không đạo cụ. Toàn bộ ly phải nằm trong khung vuông, chiếm khoảng 80% chiều cao.
- Giữ nguyên thành phần được mô tả cho từng món; không thêm trái cây ngoài ly hoặc topping không có trong prompt. Matcha dâu sữa phải có ba tầng dâu đỏ – sữa trắng – matcha xanh.
- Yêu cầu ảnh sắc nét, màu tự nhiên, nền sạch; kiểm tra kích thước file thực tế tối thiểu 1024×1024. Kích thước yêu cầu trong prompt là định hướng, không phải bảo đảm đầu ra.
- Các mô hình ảnh khác có thể hiểu prompt này nhưng không có cam kết “tương thích 100%”; không cần tham số riêng của Midjourney khi dùng image_gen.

## 2. Prompt hoàn chỉnh cho 22 món

Mỗi khối dưới đây dùng riêng cho **một ảnh**. Các prompt thực tế cũng được lưu tại `output/imagegen/drink-menu-2026-10-11/prompts/`; `jobs.json` là danh sách có cấu trúc.

### Cà phê — WAKE

#### 1. Cà Phê Sữa (`ca-phe-sua.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: traditional Vietnamese iced milk coffee (ca phe sua da), rich golden-caramel brown robusta coffee blended with sweetened condensed milk, subtle natural coffee-and-milk marbling, clear ice cubes throughout, no whipped cream, no toppings.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 2. Cà Phê Đen (`ca-phe-den.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: traditional Vietnamese iced black coffee (cà phê đen đá), deep dark robusta coffee with visible clear ice cubes and a delicate thin layer of golden-brown crema froth at the top surface.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

### Matcha — FOCUS

#### 3. Matcha Caramel (`matcha-caramel.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: layered iced matcha latte with warm amber caramel sauce drizzled inside the cup walls, milk at the bottom, rich green ceremonial matcha layer on top with clear ice cubes.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 4. Matcha Dừa Non (`matcha-dua-non.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: iced drink with clear fresh coconut water and tender strips of fresh young coconut meat (cùi dừa non) floating inside, topped with a vibrant green ceremonial matcha layer and ice cubes.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 5. Matcha Xoài Sữa (`matcha-xoai-sua.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: colorful 3-layer iced drink with golden-yellow fresh mango fruit puree at the bottom, creamy white fresh milk in the middle, and vibrant green matcha on top with clear ice cubes.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 6. Matcha Dâu Sữa (`matcha-dau-sua.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: colorful 3-layer iced drink with rich red strawberry puree and strawberry bits at the bottom, fresh white milk in the middle, and deep green ceremonial matcha on top with clear ice cubes.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 7. Matcha Coldwhisk (`matcha-coldwhisk.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: cold-whisked pure ceremonial grade Uji matcha iced drink, vibrant emerald green with a thick velvety layer of smooth matcha froth on top, clear ice cubes visible.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 8. Matcha Latte (`matcha-latte.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: classic iced matcha latte with a smooth swirl gradient of creamy white milk and vibrant green Japanese matcha, clear ice cubes visible throughout.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

### Trà trái cây — REFRESH

#### 9. Trà Bưởi (`tra-buoi.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: refreshing iced golden-pink tea with clear ice cubes, generously topped with fresh juicy pink pomelo pulp segments (tép bưởi hồng tươi).
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 10. Trà Cam Quýt (`tra-cam-quyt.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: vibrant amber-orange iced citrus tea with ice cubes, garnished with a slice of fresh orange and mandarin citrus wedges.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 11. Trà Vải Hoa Hồng (`tra-vai-hoa-hong.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: delicate blush pink iced floral tea with clear ice cubes, topped with peeled juicy whole white lychee fruits and a few delicate dried pink rose petals.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 12. Trà Lựu Đỏ Habicus (`tra-luu-do-habicus.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: deep ruby-red hibiscus iced tea with sparkling clear ice cubes, topped with fresh red pomegranate seeds and a thin slice of lime.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 13. Trà Chanh Dây Nhiệt Đới (`tra-chanh-day-nhiet-doi.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: bright golden-yellow iced tropical tea with clear ice cubes and authentic black passion fruit seeds floating in the vibrant yellow tea.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 14. Trà Dưa Lưới (`tra-dua-luoi.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: refreshing pale green iced melon tea with clear ice cubes, garnished with small round fresh cantaloupe / honeydew melon balls on top.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 15. Trà Đào Cam Sả (`tra-dao-cam-sa.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: classic Vietnamese iced peach lemongrass tea with amber color, clear ice cubes, sliced yellow peach wedges, a slice of fresh orange, and a fragrant lemongrass stalk tip.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 16. Trà Tắc (`tra-tac.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: traditional Vietnamese iced kumquat tea with golden-amber tea color, clear ice cubes, and freshly cut halved green and orange kumquats floating on top.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 17. Trà Chanh Dây Chôm Chôm (`tra-chanh-day-chom-chom.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: bright golden passion fruit iced tea with passion fruit seeds, topped with peeled whole juicy sweet rambutan fruits (chôm chôm) and clear ice cubes.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 18. Trà Đào Lựu Đỏ (`tra-dao-luu-do.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: layered iced fruit tea with deep red pomegranate juice and amber tea, clear ice cubes, topped with sliced yellow peach wedges and red pomegranate seeds.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 19. Trà Xoài Yakult (`tra-xoai-yakult.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: creamy pastel orange-yellow iced beverage made of Yakult probiotic yogurt blended with sweet mango puree, clear ice cubes visible.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 20. Trà Me (`tra-me.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: traditional Vietnamese iced tamarind drink (đá me) with rich brownish-amber tea color, crushed ice, cooked tamarind pulp, and crunchy roasted peanuts sprinkled on top.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 21. Trà Dâu (`tra-dau.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: bright ruby-red iced strawberry tea with clear ice cubes, topped with slices and halves of fresh red ripe strawberries.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

#### 22. Trà Việt Quất (`tra-viet-quat.jpg`)

```text
Use case: product-mockup.
Asset type: square 1:1 high-resolution photorealistic Vietnamese drink menu catalog photo.
Scene/backdrop: seamless warm beige matte studio surface and backdrop, very soft diagonal window-blind shadows on background, soft warm natural side lighting and a subtle clean contact shadow beneath the cup.
Composition: exactly one plain unprinted crystal-clear plastic takeaway cup, open top with no lid and no straw, centered, entire rim and base visible, cup occupies about 80% of frame height, consistent front three-quarter view slightly above rim, straight vertical cup, generous uncluttered margins. Clear smooth plastic with fine natural highlights, no heavy condensation obscuring drink.
Drink: deep purple-violet iced blueberry tea with clear ice cubes, generously garnished with plump whole fresh dark blueberries floating on top.
Quality: sharply resolved full cup, crisp rim, ice and authentic ingredient detail, clean smooth background, natural realistic food color, commercial catalog-quality photograph, not CGI. No grain, noise, blur, pixelation, compression artifacts, halos, artificially sharpened edges or exaggerated saturation.
Constraints: no logo, brand name, text, watermark, hands, people, cafe interior, wooden table, props, additional cups, fruit outside cup, added ingredients. All garnish must be contained in the cup. Square image, preferably 1536 by 1536 or higher.
```

## 3. Lưu ảnh và kiểm tra trên website

1. Lưu bản PNG gốc trong `output/imagegen/drink-menu-2026-10-11/masters/` và giữ prompt tương ứng. Bản sao 22 ảnh cũ nằm trong thư mục `before/` cùng đợt.
2. Xuất JPEG từ PNG gốc ở kích thước nguyên bản, quality 92, chroma 4:4:4; không upscale và không nén lặp lại nhiều lần. File `.jpg` phải thực sự có định dạng JPEG.
3. Thay đúng file trong `public/images/drinks/`. Mapping mặc định sẽ dùng ảnh mới; dữ liệu sản phẩm có `image_url` riêng có thể trỏ sang nơi khác nên cần đối chiếu URL thực tế.
4. Tải lại trang và kiểm tra cả thẻ món lẫn trang chi tiết. Nếu trình duyệt hoặc CDN giữ ảnh cũ, tải lại bỏ cache hoặc triển khai lại theo quy trình của dự án. Thay file local không đồng nghĩa website đang chạy trên hosting đã được cập nhật.
5. Kiểm tra đúng món, màu/tầng thức uống, đá/topping, độ nét, không logo/chữ, không cắt mất miệng hay đáy ly. Các file `*.result.json` trong thư mục đợt tạo ghi nguồn ảnh, kích thước và ghi chú kiểm tra.
