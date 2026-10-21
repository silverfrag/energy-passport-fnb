# Fame Drink — bản sửa theo reference / v5

Cập nhật 19/10/2026. Bản này thay v4 sau phản hồi trực tiếp của người dùng. Nguồn chuẩn để review là website thật và screenshot v5; không dùng mockup để thay cho kiểm tra bản chạy.

## Các sai lệch đã được chỉ rõ

1. Khung giá bên cạnh ly ở hero do tự thêm, khác mẫu đã duyệt.
2. Thiếu chữ FAME chìm trong nền; bố cục bị trống.
3. Ảnh và chữ dùng chung vùng định vị, dễ che nhau ở các tỷ lệ trung gian. Kiểm tra overflow đơn thuần không phát hiện được điều này.
4. Menu/detail vẫn giống bố cục catalog phổ thông, chưa khai thác cách đặt sản phẩm làm tâm điểm của reference.
5. Phần dưới kéo dài bằng các card vòm/card hướng dẫn lặp lại, chưa có nhịp phân vùng như ảnh xanh và ảnh Fame được gửi lại.

## Reference và ràng buộc cần giữ

Ảnh mới #1: trang Starbucks dài, phân vùng sản phẩm → câu chuyện với ly giữa → ribbon chéo → các nội dung phụ → liên hệ/footer. Lấy nhịp và cấu trúc, không sao chép thương hiệu hay bịa chi nhánh.

Ảnh #2: sản phẩm lớn ở giữa, watermark nền, điều hướng trái/phải; dùng làm căn cứ cho sân khấu khám phá menu.

Ảnh #3: bố cục hero bất đối xứng, chữ dọc viền, thumbnail chọn món; tham khảo tỷ lệ và chiều sâu, không đổi Fame thành thương hiệu xanh Starbucks.

Ảnh #4: mockup Fame đã được người dùng đánh giá thú vị hơn. Hero espresso, h1 condensed lớn, FAME chìm, giá không khung, sản phẩm trên bệ đá, menu với ly tách nền nhô khỏi mặt thẻ; spotlight Matcha/Passport nối nhau.

Các reference được giữ tại `work/reference-v5` của task, với đúng tên file clipboard người dùng cung cấp. Ràng buộc cho lần chỉnh sau: không tự thêm box vào caption hero; không bỏ watermark; không dùng absolute-position để đặt chữ chức năng đè lên vùng ảnh sản phẩm; không thay phân vùng bằng một dãy card đồng dạng; không coi axe/overflow=0 là bằng chứng thiết kế giống mẫu.

## Thay đổi v5

### Home

- Hero dùng grid hai vùng copy/scene, chuyển thành luồng dọc trên mobile. Vùng ảnh là scene bệ đá riêng, có mask chuyển nền. Caption tên/giá bỏ nền, viền, padding và góc bo; ở tỷ lệ nhỏ caption vào hàng riêng.
- Watermark FAME là HTML trang trí độc lập, nằm sau nội dung, không được bake vào ảnh. H1, mô tả, CTA, thumbnail và caption là các phần tử thật.
- Menu home dùng hình sản phẩm nhô khỏi nền thẻ, bỏ badge đè bánh/miệng ly, rút gọn thông tin như reference.
- Bỏ ba thẻ vòm khám phá lặp lại. Thay bằng Matcha tràn khung nối với Passport, câu chuyện nền xanh espresso với ly trung tâm và các ghi chú hai bên, dải chữ chéo, hướng dẫn dạng rail, liên hệ có nhãn dọc và các hàng lệch nhịp.
- Bìa Passport dùng hình khối CSS riêng, nằm trong ô bố cục dành riêng; không che heading/body/CTA.

### Menu

- `ProductShowcase.tsx` là client component nhẹ, dùng danh sách món active lấy từ server. Nút trước/sau chuyển món thật; thumbnail có `aria-pressed`; tên được thông báo qua live heading. Tên/giá/hình/CTA đổi đồng bộ theo món đang chọn.
- Hình ly lớn ở giữa, copy bên trái và giá/thêm giỏ bên phải. Watermark FAME và vòng viền là trang trí; nội dung chức năng nằm trong grid riêng.
- Ba nhóm catalog có mảng màu liên tục thay vì toàn bộ trên nền kem: cà phê/kem, matcha/pistachio, trái cây/peach. Giữ anchor `/menu#ca-phe`, `#matcha`, `#tra-trai-cay`, số lượng thật và toàn bộ món active.
- Món inactive không xuất hiện. Giá/null-price và trạng thái chưa nhận đặt tiếp tục dùng logic hiện tại.

### Detail

- Thay hai cột ảnh vuông + thông tin bằng sân khấu ba phần: editorial, centerpiece, purchase panel. Watermark theo nhóm vị, màu nền theo nhóm, hình ly lớn và vòng viền.
- Tên/description/tasting notes thật nằm trong vùng copy. Giá/add/view-cart trong panel kem. Không thêm tùy chọn size/milk không được hệ thống hỗ trợ.
- Tablet sắp purchase panel xuống hàng; mobile xếp ảnh → nội dung → mua hàng, không dùng phép thu nhỏ toàn bộ bố cục desktop.
- Giữ metadata, canonical, route, kiểm tra inactive, fallback catalog và gợi ý món liên quan.

## Mapping component

| Phần thiết kế | Code |
| --- | --- |
| Hero / nội dung dưới home | `src/app/(public)/page.tsx` |
| Sân khấu chuyển món | `src/components/ProductShowcase.tsx` |
| Catalog và vùng màu | `src/app/(public)/menu/page.tsx` |
| Card với sản phẩm nhô khỏi nền | `src/components/ProductCard.tsx` + `.fd-product-*` |
| Detail ba vùng | `src/app/(public)/menu/[slug]/page.tsx` |
| Chọn ảnh, bảo toàn upload riêng | `src/lib/constants/product-art.ts` |
| Hệ thống responsive | `src/app/(public)/storefront.css` |
| Giỏ / validation / submit | Giữ `CartProvider`, `CheckoutClient`, các API hiện có |

Tokens chính giữ espresso `#29180f`, ivory `#f5eee1`, copper action `#a84321`, pistachio `#ccd6b0`; bổ sung vùng câu chuyện `#18291f` và catalog peach `#eac6af`. Font vẫn Barlow Condensed / Plus Jakarta Sans / Playfair Display. Public CSS scoped dưới `.takeaway-site`; không đổi theme admin.

## Ảnh và bảo toàn dữ liệu

Không tạo ảnh AI mới trong revision này. Giữ ảnh campaign `espresso-hero-v4.webp`. Bốn cutout v4 được trim phần viền trong suốt và lưu sibling `biscoff/matcha/peach/mango-cutout-v5.webp`; bản gốc v4 còn nguyên. Trim giúp ly chiếm đúng vùng được cấp, đặc biệt trong spotlight mobile, thay vì tăng ảnh lấn vào chữ.

`getProductArt` chỉ thay ảnh bundled mặc định; ảnh upload riêng trong catalog luôn thắng. Những món khác dùng ảnh gốc. Không thay schema/storage/API/giá, không bật nhận đơn, không tạo đơn thật, không commit/push/deploy. Source v4 trước khi sửa được giữ ở `work/pre-v5-backup` của task.

## Kiểm định

- Build và TypeScript: qua. Lint: qua. 19/19 test cart và order security: qua.
- Home, menu và Biscoff detail ở 1440/1100/900/768/600/390/320px: 21 tổ hợp bố cục. Kiểm tra vùng copy/ảnh, spotlight copy/art, Passport copy/book, editorial/centerpiece/purchase và showcase columns; chụp cả tỷ lệ trung gian. Đây là đo bounding boxes của các vùng chỉ định, không phải chứng nhận mọi pixel của trang.
- Axe WCAG A/AA và 2.1/2.2 AA ở 1440/390/320 cho ba route; kiểm tra thêm ba variant showcase ở 1440/768/390/320. Độ tương phản nhãn nhỏ vùng trái cây được sửa sau lượt đầu.
- Interaction: arrow next/previous trở về đúng món; chọn Matcha/Trà Đào/Biscoff đổi đúng theme; thêm món đang chọn, kiểm tra đúng món trong giỏ và reload persistence, ở bốn độ rộng.
- Reports: `v5-visual-audit.json`, `v5-interaction-audit.json`; screenshots `v5-home-*`, `v5-menu-*`, `v5-menu-ca-phe-sot-biscoff-*`, `v5-menu-stage-FOCUS/REFRESH.png` trong outputs của task. Các bản v4/before được giữ để so sánh.
- Ảnh WebP responsive qua Next Image, eager/priority cho hình chính, lazy cho nội dung dưới; không tải thêm thư viện carousel hoặc ảnh full-page mockup. Chưa có đo Core Web Vitals production.

Kết quả cuối: 21 tổ hợp bố cục đều HTTP 200, không ghi nhận lỗi JS, ảnh lỗi, tràn ngang hay giao nhau trong các cặp vùng đã đo; 9 lượt axe toàn trang và 12 lượt axe variant không còn violation. Home được kiểm lại riêng 7 độ rộng sau khi giới hạn grid ảnh cuối cùng, kết quả vẫn không phát hiện các lỗi trên. Báo cáo bổ sung: `v5-home-final-audit.json`.

## Preview và phần còn giới hạn

Repo đúng: `E:\Website + Passport Energy\energy-passport-app`. Preview production local: http://127.0.0.1:3014/. Server dev cũ vẫn có thể tồn tại ở 3000, không dùng 3001 để review revision này.

Nhận đơn online vẫn tắt theo config thật; không test thanh toán/giao hàng bằng đơn thật. Canonical local vẫn dùng origin `http://localhost:3000` từ cấu hình sẵn có; cần verified production origin trước khi publish. Cảnh báo middleware→proxy có từ trước vẫn còn.

Figma file https://www.figma.com/design/8lNyWv7q6BmS5IsI9psUCf vẫn lưu baseline và phương án editorial cũ. V5 chưa đồng bộ thành native Figma; không coi các frame cũ là bản thiết kế mới. Nội dung hiện tại để người dùng đánh giá là code và screenshot thực tế v5.
