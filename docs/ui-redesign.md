# Fame Drink — giao diện và mua hàng / v12

Cập nhật 20/10/2026. Bản review chạy tại http://127.0.0.1:3014. V12 bỏ size tự chọn và chuẩn hóa ảnh catalog theo yêu cầu người dùng. Lịch sử v11 được lưu trong `ui-redesign-v11.md`; các quyết định hero/motion/nền có trong `ui-redesign-v10.md` và các bản trước.

## Chọn size chủ động

Mỗi selector khởi tạo với `size = null`: không radio nào được chọn, giá hiển thị “Từ” theo size S và nút ghi “Chọn size trước”. Chỉ bật thêm giỏ khi người mua chọn S/M/L. Đổi món ở sân khấu menu sẽ tạo selector mới, không mang size từ món trước. Tải lại trang cũng trở về chưa chọn. Size đã được chọn và thêm vào giỏ vẫn được lưu riêng theo món + size.

`CartProvider.addItem` yêu cầu truyền size rõ ràng, không còn tham số mặc định M. Khả năng đọc giỏ, draft và đơn cũ thiếu size vẫn giữ M để tương thích dữ liệu đã tồn tại; đây không phải tự chọn trên UI.

Chính sách demo được người dùng duyệt giữ nguyên: giá catalog là M, S = M − 5.000đ, L = M + 5.000đ; S tối thiểu 1.000đ. Ví dụ Biscoff S/M/L là 26/31/36k. Không thêm dung tích chưa được cung cấp. Server tiếp tục tính giá từ catalog đáng tin cậy và snapshot size vào JSON đơn hàng. Không cần migration DB.

## Hệ ảnh thương hiệu

32 món có bộ ảnh catalog mới, cùng thân ly PET thẳng đứng, góc nhìn chính diện hơi từ trên xuống, ánh sáng mềm phía trên trái và fill phải. Điểm nhận diện từng món nằm ở màu đồ uống, lớp sữa/trà/cà phê, đá, thạch, trái cây, kem, bánh, nắp và ống hút. Không dùng một nội dung ly lặp lại rồi đổi màu.

Ảnh được chỉnh bằng **built-in ImageGen** theo ba tham chiếu: ảnh đúng món là nguồn nhận diện, ảnh sương sáo chỉ làm chuẩn camera/thân ly, ảnh guide chỉ làm chuẩn bố cục. Ba món có dome/straw được chỉnh riêng chiều cao nắp và đoạn ống hút lộ ra để không làm thân ly nhỏ hơn các món khác. Ảnh nguồn và các bản trước vẫn được giữ.

Sau bước ảnh, export dùng chung khung alpha **900 × 1300px**. Hiệu chỉnh theo miệng và đáy thân ly thay vì bounding box của cả topping: tâm miệng (450, 400), rộng 620px, đáy y1200, thân cao 800px. Phần trên miệng được dành cho bánh/kem/nắp/ống hút. Kiểm tra foreground nằm trong khung, không cắt topping. 32 WebP quality 90, alpha 100 có tổng dung lượng 4.89 MB.

Asset thực tế: `public/images/campaign/brand-v12/<slug>.webp`. `product-art.ts` ánh xạ 32 slug sang bộ mới; ảnh do người dùng upload riêng tiếp tục được ưu tiên. Menu, detail, các món liên quan và ảnh của sản phẩm mới thêm vào giỏ dùng bộ ảnh này. Giỏ đã lưu trước đó giữ snapshot ảnh cũ. Home giữ bộ ảnh campaign đã duyệt và motion/bố cục đã chốt; selector size trên home cũng khởi tạo chưa chọn.

Khung ảnh của card, sân khấu menu và detail được điều chỉnh theo tỷ lệ 900:1300 để cùng một thân ly có kích thước nhất quán. Nền theo nhóm espresso/matcha/berry/mango giữ hệ riêng theo vị.

## Mapping component

| Phần | Nguồn |
| --- | --- |
| Size chưa chọn, giá bắt đầu, radio và trạng thái nút | `src/features/orders/AddToCartButton.tsx` |
| Yêu cầu size khi thêm, ảnh snapshot mới | `src/features/orders/CartProvider.tsx` |
| Giá S/M/L dùng chung UI/server | `src/lib/constants/product-sizes.ts` |
| 32 ảnh catalog và 4 ảnh campaign | `src/lib/constants/product-art.ts` |
| Card và flag ảnh đã chuẩn khung | `src/components/ProductCard.tsx` |
| Đổi món, reset size và sân khấu ảnh | `src/components/ProductShowcase.tsx`, `DrinkMotionStage.tsx` |
| Ảnh detail và mua hàng | `src/app/(public)/menu/[slug]/page.tsx` |
| Home dùng art mode campaign | `src/components/HomeHero.tsx`, `src/app/(public)/page.tsx` |
| Kích thước khung desktop/mobile | `src/app/(public)/storefront-motion.css` |
| Giỏ và tương thích dữ liệu cũ | `cart-model.ts`, `checkout-draft.ts`, `CheckoutClient.tsx` |

## Kiểm định v12

- Production build, TypeScript và lint đạt. Next vẫn có cảnh báo middleware → proxy đã có từ trước.
- 25/25 test cart/order-security đạt, gồm legacy cart/draft, khóa món + size, tính giá từ catalog server và snapshot size.
- Playwright trên 1920×1080, 1366×768, 900×1000, 390×844 và 320×800: cả 32 card và detail không chọn size sẵn; nút thêm bị khóa; đổi món bằng next/previous reset lựa chọn; reload không tự chọn lại; chọn và thêm S/M/L vào giỏ giữ đúng 26/31/36k cùng ba dòng riêng và ảnh mới.
- Không lỗi JavaScript hay tràn ngang trong các luồng trên. Axe WCAG 2 A/AA, 2.1 AA và 2.2 AA trên menu ở năm độ rộng và detail mobile 390px: 0 vi phạm tự động. Home mobile cũng được xác nhận không chọn size sẵn và khóa thêm giỏ trước lựa chọn. Không thay thế kiểm tra accessibility thủ công đầy đủ.
- Kiểm tra trực tiếp metadata của 32 asset WebP: tất cả 900 × 1300px và có alpha thật; báo cáo `outputs/v12-assets-audit.json`.
- Đã xem screenshot menu desktop và detail mobile, cùng contact sheet cả 32 ảnh để đối chiếu đường miệng/đáy và sự khác biệt nguyên liệu. Các kích thước còn lại có screenshot trong outputs của task.
- Không tạo đơn thật, không ghi DB remote, không deploy/commit. Chưa đồng bộ Figma v12.

## Artifact và prompt

- `ui-redesign-assets-v12.json`: nguồn, asset đích, khung, hệ số hiệu chỉnh, bounds và dung lượng của 32 ảnh.
- `ui-redesign-photo-prompt-v12.txt`: prompt chính xác cho hệ ảnh mới. Mode là built-in ImageGen edit với nền trong suốt; không dùng API/CLI fallback.
- Trong workspace task: `work/brand-v12/raw/` giữ PNG nguồn mới; `work/brand-v12/straw-repair.md` giữ prompt bổ sung chính xác và provenance hai pass cho ba món dome/straw.
- `outputs/v12-brand-contact-sheet.png`: đối chiếu 32 món trên cùng đường miệng/đáy. `outputs/v12-menu-<width>.png`, `v12-detail-<width>.png` và `v12-audit.json`: kết quả browser v12.
