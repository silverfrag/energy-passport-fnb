# Fame Drink — responsive và motion / v6

Cập nhật 19/10/2026. Nguồn review là website thật tại http://127.0.0.1:3014 và clip quay từ bản chạy. Chi tiết bố cục/catalog/detail v5 được giữ trong `ui-redesign-v5.md`.

## Vấn đề và quyết định

Ảnh hero trước đây nằm trong shell tối đa 1440px. Trên màn rộng, scene dừng trước mép viewport làm lộ đường nối nền; tỷ lệ chữ/ảnh giữ nguyên khiến khoảng trống tăng. V6 giữ vùng đọc giới hạn nhưng kéo scene tới mép viewport bằng phần bù gutter và phần dư ngoài shell. Kiểm tra theo viewport CSS 1920 và 2560px, không suy ra kết quả chỉ từ kích thước vật lý 24 inch.

Trên màn rộng hơn 1440px, chiều cao hero, cỡ H1 và watermark tăng có giới hạn bằng clamp; caption dịch sang 50% để giữ khoảng cách với H1. Tablet/mobile tiếp tục bố cục xếp dọc, không thu nhỏ desktop nguyên khối. Không thêm hộp giá hay bỏ watermark FAME.

## Tham khảo video thực tế

- Hai MP4 đầu là cùng một video (SHA256 trùng), quay website kem NICK’s: carousel đổi sản phẩm/màu nền, đường phân vùng dạng sóng và nhịp nội dung theo scroll.
- Video thứ ba dùng lon nước xoài nghiêng/di chuyển giữa các cảnh, chữ xuất hiện và nền kem chuyển vàng.
- Áp dụng chọn món thủ công đổi ảnh/tên/giá/link/màu nền đồng bộ; ly tách nền nghiêng nhẹ khi vào; nội dung xuất hiện một lần khi vào viewport; đường sóng nối sang Matcha/Passport.
- Không dùng tự chạy carousel, scroll hijacking hay ép người mua chờ animation. Không sao chép tên/logo của reference.

## Mapping và hành vi

| Phần | Code |
| --- | --- |
| Chọn món ở home, trạng thái thumbnail và live status | `src/components/HomeHero.tsx` |
| Reveal một lần bằng IntersectionObserver | `src/components/HomeMotion.tsx` |
| Wide-screen scene, transition, keyframes và reduced motion | `src/app/(public)/storefront-motion.css` |
| Lắp hero/reveal và đường sóng | `src/app/(public)/page.tsx` |
| Animation ảnh/tên khi chọn món ở menu | `src/components/ProductShowcase.tsx` |
| Import stylesheet public | `src/app/(public)/layout.tsx` |

Giữ dữ liệu sản phẩm active từ server và ảnh upload riêng. Tên, giá, CTA và detail route cập nhật theo món chọn. Thumbnail là button có aria-pressed, focus nhìn thấy và dùng được bàn phím. Không đổi API, logic checkout, dữ liệu hay trạng thái nhận đặt hàng.

Motion chỉ dùng transform/opacity và chuyển màu nền. Ảnh cinematic Biscoff không bị nghiêng; hiệu ứng nghiêng dành cho ly tách nền. Reveal không ẩn nội dung trước khi JavaScript chạy. `prefers-reduced-motion: reduce` tắt animation/transition; observer dọn dẹp khi unmount hoặc khi đổi preference. H1 và nội dung vẫn hiện khi tắt JavaScript; tương tác chọn món cần JavaScript.

## Kiểm định và giới hạn

- Build production và lint đạt; 19/19 test cart/order-security đạt. Cảnh báo middleware→proxy có sẵn vẫn còn.
- Kiểm tra home ở 1366, 1440, 1920, 2560, 900, 390 và 320px; 28 trạng thái chọn món không tràn ngang, không chồng hai vùng copy/scene và không ảnh hero hỏng.
- Scene chạm mép phải ở 1920 và 2560px; khoảng cách caption/H1 trên màn rộng ít nhất 24px theo phép đo text range.
- Axe trên 7 trang home đã ổn định: 0 vi phạm tự động được phát hiện. Đây không thay thế audit accessibility thủ công đầy đủ.
- Kiểm tra bàn phím → chọn Matcha → detail đúng món → giỏ đúng món → reload còn giỏ, ở cả motion thường và giảm motion. Không gửi POST tạo đơn.
- Chế độ giảm motion: animation none, transition 0s. Nội dung ban đầu vẫn hiện khi JavaScript tắt.
- Clip `v6-motion-demo.webm` quay từ website, không phải mockup. Báo cáo `v6-audit.json`, `v6-flow-audit.json` và screenshot ở thư mục outputs của task.
- Figma chưa được đồng bộ v6; không coi file Figma cũ là bản phản ánh chính xác production preview này. Không deploy hay commit trong lần chỉnh này.

## V7 — chuyển động ly sau phản hồi

Thay việc remount ảnh và fade 0,6s bằng DrinkMotionStage: giữ các lớp sản phẩm trong DOM, ly ra/vào theo cung dịch ngang 105%, hạ 18%, nghiêng 26 độ và scale 0,8 → 1 trong 1,15s. Opacity ly đi ra chỉ giảm cuối hành trình. CSS transition tiếp tục từ trạng thái hiện tại khi bấm liên tiếp. Dùng chung cho menu và home; home giữ ảnh cinematic lúc đầu, chuyển sang ly tách nền khi bắt đầu chọn vị. Lớp trang trí aria-hidden; link, caption và nút chọn cung cấp tên truy cập. Reduced motion tắt transition.

Lint/build đạt. Kiểm tra 1920 và 390px ở cả home/menu: có transform trung gian, hai ly còn opacity khi chuyển, chọn liên tiếp kết thúc đúng món, không tràn ngang; reduced-motion transition 0s. Video mới: outputs/v7-cup-motion.webm. Không dùng kết quả v6 để khẳng định đã kiểm định toàn bộ responsive v7.

### V7.1 — nút next/previous

Vùng fd-drink-motion mở rộng tràn qua hai mũi tên ở desktop và bắt pointer thay nút. Sửa pointer-events:none trên lớp trang trí và position/z-index cho nút. Kiểm tra click thực tại 1920/390px, next/previous qua đầu-cuối danh sách, bấm liên tiếp và link detail của ly. Build đạt.

### V8 — nền đồng nhất và chiều cao màn hình

Bỏ nhánh ảnh cinematic chỉ dùng trước lần tương tác đầu. Home dùng DrinkMotionStage và cùng nền espresso ngay từ SSR; chọn lại Biscoff trả về đúng trạng thái ban đầu. Giữ nền/watermark chung giữa các nhóm món. Desktop trên 900px dùng min-height calc(100svh - 89px) cho composition, tương ứng header 89px; cho phép nội dung tăng chiều cao tự nhiên ở viewport thấp. Mobile giữ luồng nội dung responsive.

Build/lint đạt. Kiểm tra 1900×914 (gần viewport screenshot người dùng), 1920×1080, 2560×1440, 1366×768, 1440×900, 1024×768, 390×844: nền trước/sau chọn Matcha/quay về Biscoff giống nhau, không tràn ngang; desktop hero phủ hết phần viewport dưới header. Screenshot và số đo tại outputs/v8-home-1900.png, v8-home-390.png, v8-audit.json của task.

### V9 — chung ngôn ngữ thiết kế, nền riêng theo ly

Sửa cách hiểu v8: thống nhất kiểu dựng nền, không cố định tất cả món về espresso. Home và menu dùng FlavourBackdrop với bốn lớp nền tồn tại sẵn, mỗi lớp có gradient tối→ánh sáng, orbit chấm, đường contour và nét nguyên liệu. Biscoff: espresso/caramel, hạt và vụn. Matcha: forest/olive, lá trà. Đào Lựu: plum/coral, lát quả và hạt. Xoài Yakult: ochre/cream, lát xoài và bọt sữa. Ánh sáng, vị trí và tỷ lệ họa tiết theo cùng quy tắc; bảng màu, accent chữ nhỏ, outline và watermark đổi theo vị.

Mapping: src/components/FlavourBackdrop.tsx chứa getFlavourTheme, SVG nguyên liệu và các panel. HomeHero/ProductShowcase dùng chung component và data-flavour; storefront-motion.css chứa bảng màu và transitions. SVG trang trí được viết bằng code, không thêm bitmap/request ảnh. Các panel crossfade opacity 0,9s; nét nền dịch nhẹ/rotate 1,3s theo ly. Không có loop/timer. Reduced motion tắt transitions. Toàn bộ backdrop aria-hidden, pointer-events:none, z-index âm trong section isolation; giữ vùng bấm của arrows và link.

Khác với bug cũ, mỗi món chỉ có một cách hiển thị: ngay lần tải đầu dùng cùng cutout và background recipe như lúc chọn lại; không bật/tắt ảnh cinematic sau tương tác. Giữ hero desktop phủ vùng nhìn bằng min-height theo svh. Đây là bản thay thế quyết định cố định màu ở v8.

Kiểm định V9: lint và production build đạt. Desktop 1920/1366 và mobile 390px kiểm tra cả home/menu với đủ bốn nền; thêm home 2560×1440. Bốn nền khác nhau, chọn lại món ban đầu cho cùng màu/họa tiết, không tràn ngang và desktop hero tiếp tục phủ viewport. Axe tại 1920/390px với đủ bốn vị ở home/menu không phát hiện vi phạm tự động. Next/previous qua vòng đầu-cuối vẫn hoạt động; giảm chuyển động đưa transition nền về 0s. Ảnh so sánh thực: outputs/v9-four-backgrounds.png; clip: outputs/v9-flavour-scenes.webm. Lần kiểm tra mobile đầu có assertion sai do so tọa độ viewport trước/sau tự cuộn đến nút; đổi đo tọa độ document và kiểm tra lại, không sửa code để né cuộn.

### V10 — cuộn trên ly để đổi vị

HomeHero gắn native wheel listener với passive:false vào đúng wrapper fd-hero-v7-cups. Cuộn xuống chọn món kế, cuộn lên chọn món trước, đi vòng danh sách; cả ly, tên, giá và FlavourBackdrop dùng chung selectedIndex. Ngưỡng 60px đã chuẩn hóa deltaMode, cooldown 1200ms theo nhịp chuyển ly và yêu cầu nghỉ 180ms để rearm cử chỉ; quán tính trackpad không chuyển liên tục. Listener được dọn khi unmount hoặc đổi số sản phẩm. Không thêm listener toàn trang.

Vùng chữ/ngoài ly vẫn cuộn trang. Khi hero đã cuộn khỏi đầu vùng nhìn, wheel trên ly cũng trả về cuộn trang. Ctrl/meta/shift, horizontal gesture và pointer coarse không bị chặn; tôn trọng thao tác zoom. Mobile dùng thumbnail sẵn có. Thêm chỉ dẫn nhỏ Cuộn trên ly để đổi vị cho fine pointer. Reduced motion vẫn chọn món nhưng CSS đưa animation/transition về tĩnh.

Kiểm định V10: lint/build production đạt. Playwright với wheel thực kiểm tra ngưỡng delta, cuộn lên/xuống, vòng đầu-cuối, chuỗi quán tính 16 sự kiện chỉ đổi một món, trang đứng yên trong vùng ly và cuộn bình thường ở H1, zoom/horizontal/modified wheel không bị preventDefault, thumbnail vẫn chọn được. Kiểm tra cả motion thường và reduced-motion; mobile touch không chặn wheel, thumbnail hoạt động. Không lỗi JavaScript. Report outputs/hero-wheel-audit.json, clip bản chạy outputs/hero-wheel-demo.webm.
