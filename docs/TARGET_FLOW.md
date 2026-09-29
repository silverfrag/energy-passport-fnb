# TARGET PRODUCT FLOWS — Energy Passport MVP

Tài liệu mô tả 4 flow chính trong Core Customer Loop của Energy Passport Web App, trực quan hóa bằng Mermaid.

---

## FLOW A: DISCOVERY → RECOMMENDATION

Khách vãng lai truy cập website, check-in trạng thái bằng ngôn ngữ tự nhiên và nhận gợi ý đồ uống phù hợp cùng micro-action. Không bắt đăng nhập.

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách vãng lai
    participant Web as Web App (/check-in)
    participant Engine as Recommendation Engine
    participant DB as Supabase DB

    Customer->>Web: Truy cập Home hoặc /check-in
    Note over Customer,Web: Không yêu cầu login
    Web->>Customer: Bước 1: "Bạn đang cảm thấy thế nào?" (1-5: Rất tỉnh -> Rất mệt)
    Customer->>Web: Chọn mức năng lượng (VD: Mệt = 4)
    Web->>Customer: Bước 2: "Bạn muốn trạng thái nào?" (Tỉnh táo hơn / Tập trung ổn định / Thư giãn)
    Customer->>Web: Chọn mong muốn (VD: Tập trung ổn định)
    Web->>Engine: Gửi { fatigueLevel: 4, desiredState: 'FOCUS' }
    Engine->>DB: Query các sản phẩm và micro-actions active của nhóm FOCUS
    DB-->>Engine: Trả về danh sách
    Engine->>Engine: Quy tắc tất định: Chọn món ưu tiên cao nhất + Micro-action FOCUS 25+
    Engine-->>Web: Trả về kết quả { category, product, microAction, explanation }
    Web->>Customer: Hiển thị trang /recommendation
    Note over Customer,Web: Kết quả gồm: Món FOCUS Matcha, giá, caffeine ước tính, lý do ngắn gọn, bài tập 25+ và nút tìm quán/menu
```

---

## FLOW B: QR SCAN → CONSUMPTION (XÁC NHẬN TIÊU THỤ)

Khách đã mua đồ uống (tại quán, qua Grab, ShopeeFood...), quét mã QR in trên tem ly. QR chỉ định danh sản phẩm. Việc ghi nhận chỉ xảy ra khi khách chủ động xác nhận (Purchase ≠ Consumption).

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách hàng
    participant QR as QR trên ly
    participant Web as Web App (/scan/[slug])
    participant Auth as Anonymous Session
    participant DB as Supabase DB
    participant Passport as Energy Passport (/passport)

    Customer->>QR: Dùng camera điện thoại quét QR
    QR->>Web: Mở URL /scan/[product-slug] (VD: /scan/focus-matcha)
    Web->>DB: Query sản phẩm theo slug
    DB-->>Web: Trả về thông tin sản phẩm (name, caffeine_mg, active)
    Web->>Customer: Hiển thị sản phẩm + Caffeine ước tính + "Bạn đang sử dụng đồ uống này?"
    
    alt Khách chỉ xem hoặc đóng tab
        Note over Customer,Web: Không ghi nhận gì cả (Purchase != Consumption)
    else Khách bấm "✓ Xác nhận — Lưu vào Passport"
        Web->>Auth: Lấy hoặc tạo anonymous session (Guest Cookie / Supabase Auth)
        Auth-->>Web: Trả về user_id ổn định
        Web->>DB: Kiểm tra duplicate (cùng sản phẩm trong 5 phút vừa qua)
        alt Trùng lặp (vừa bấm 2 phút trước)
            Web->>Customer: Hỏi: "Bạn vừa ghi nhận sản phẩm này, có muốn ghi nhận thêm?"
        else Hợp lệ
            Web->>DB: INSERT consumption_logs với caffeine_mg_snapshot cố định
            DB-->>Web: Thành công (logId)
            Web->>Customer: Thông báo "Đã ghi nhận!" kèm CTA "Lưu Passport" hoặc "Xem Passport"
            Customer->>Passport: Chuyển tới /passport
            Passport->>Customer: Hiển thị ly vừa uống, caffeine hôm nay, lịch sử gần đây
        end
    end
```

---

## FLOW C: ANONYMOUS → CLAIMED PASSPORT (BẢO TOÀN LỊCH SỬ)

Khách vãng lai đã tích lũy lịch sử tiêu thụ trong Passport tạm thời. Sau khi thấy giá trị, họ quyết định liên kết email hoặc Google để lưu trữ vĩnh viễn. Không mất bất kỳ dữ liệu nào.

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách vãng lai
    participant Passport as Energy Passport (/passport)
    participant AuthPage as Trang Lưu Passport (/auth)
    participant SupabaseAuth as Supabase Auth Service
    participant DB as Supabase DB

    Note over Customer,Passport: Khách có 2 lần uống trong ngày (user_id = anon_123)
    Passport->>Customer: Card gợi ý: "Lưu Energy Passport của bạn để không mất lịch sử"
    Customer->>AuthPage: Nhấp vào "Lưu Passport"
    AuthPage->>Customer: Form nhập Email hoặc Đăng nhập bằng Google
    Customer->>AuthPage: Nhập email (hoặc OAuth Google)
    AuthPage->>SupabaseAuth: Nâng cấp tài khoản (Link Identity / Update User)
    Note over SupabaseAuth: Liên kết email vào chính user_id = anon_123
    SupabaseAuth-->>Customer: Gửi OTP xác nhận email (hoặc callback OAuth)
    Customer->>AuthPage: Xác nhận link trong email
    SupabaseAuth-->>Passport: Chuyển hướng về /passport với tài khoản đã xác thực
    Passport->>DB: Query consumption_logs với user_id = anon_123
    DB-->>Passport: Vẫn trả về đúng 2 records đã uống lúc nãy
    Passport->>Customer: Hiển thị: "Passport của bạn" + đầy đủ 2 records cũ!
```

---

## FLOW D: RETURNING CUSTOMER (VÒNG LẶP QUAY LẠI)

Tạo thói quen tiêu thụ đồ uống có kiểm soát và gắn kết lâu dài với thương hiệu.

```mermaid
graph TD
    A[Khách quay lại vào ngày mới] --> B{Đã từng dùng?}
    B -->|Mở website| C[Passport nhận diện session qua Cookie/Auth]
    C --> D[Hiển thị trạng thái hôm nay: 0 mg caffeine]
    D --> E[Lịch sử hôm qua/tuần trước vẫn nguyên vẹn]
    E --> F[CTA: 'Check-in trạng thái hôm nay' hoặc 'Scan ly mới']
    F --> G[Chọn đồ uống theo nhu cầu WAKE/FOCUS/REFRESH]
    G --> H[Thực hiện micro-action 10+ hoặc 25+]
    H --> I[Gia tăng độ gắn kết với thương hiệu đồ uống]
```
