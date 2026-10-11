# Fame Drink — Bộ Prompt Chuẩn Phục Dựng Ảnh Thực Đơn (Studio Catalog)

Tài liệu này cung cấp công thức kiến trúc ảnh chuẩn (Master Prompt Architecture) và danh sách prompt tiếng Anh chi tiết cho từng món, tương thích 100% với:
- **Midjourney** (thêm `--ar 1:1 --v 6.1 --style raw`)
- **Flux / DALL-E 3 / Ideogram** (chọn tỉ lệ 1:1)
- **Google Imagen 3 / Gemini**

---

## 1. Công Thức Kiến Trúc Ảnh Chuẩn (Master Visual Architecture)

Tất cả ảnh phải tuân thủ nghiêm ngặt 4 nguyên tắc để đảm bảo sự đồng bộ với bộ nhận diện POS:

1. **Bối cảnh & Nền (Background)**:
   > `A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines.`
2. **Ánh sáng (Lighting)**:
   > `Soft warm natural studio side-lighting, subtle clean contact shadow under the cup base.`
3. **Thức uống & Topping (Drink Detail)**:
   > `Clear ice cubes clearly visible through the transparent cup, authentic real layers and natural fresh toppings, dome or flat transparent lid.`
4. **Quy tắc loại trừ (Negative Constraints)**:
   > `Clean cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Minimalist, realistic coffee shop menu catalog photography, not overly commercial or CGI.`

---

## 2. Danh Sách Prompt Chi Tiết Cho 22 Món Còn Lại

### Nhóm 1: Cà Phê (WAKE)

#### 1. Cà Phê Sữa (`ca-phe-sua.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: traditional Vietnamese iced milk coffee (cà phê sữa đá) with rich golden-caramel brown color from dark robusta coffee swirled with sweetened condensed milk, clear ice cubes throughout the cup. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 2. Cà Phê Đen (`ca-phe-den.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: traditional Vietnamese iced black coffee (cà phê đen đá), deep dark robusta coffee with visible clear ice cubes and a delicate thin layer of golden-brown crema froth at the top surface. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

---

### Nhóm 2: Matcha (FOCUS)

#### 3. Matcha Caramel (`matcha-caramel.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: layered iced matcha latte with warm amber caramel sauce drizzled inside the cup walls, milk at the bottom, rich green ceremonial matcha layer on top with clear ice cubes. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 4. Matcha Dừa Non (`matcha-dua-non.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: iced drink with clear fresh coconut water and tender strips of fresh young coconut meat (cùi dừa non) floating inside, topped with a vibrant green ceremonial matcha layer and ice cubes. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 5. Matcha Xoài Sữa (`matcha-xoai-sua.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: colorful 3-layer iced drink with golden-yellow fresh mango fruit puree at the bottom, creamy white fresh milk in the middle, and vibrant green matcha on top with clear ice cubes. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 6. Matcha Dâu Sữa (`matcha-dau-sua.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: colorful 3-layer iced drink with rich red strawberry puree and strawberry bits at the bottom, fresh white milk in the middle, and deep green ceremonial matcha on top with clear ice cubes. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 7. Matcha Coldwhisk (`matcha-coldwhisk.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: cold-whisked pure ceremonial grade Uji matcha iced drink, vibrant emerald green with a thick velvety layer of smooth matcha froth on top, clear ice cubes visible. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 8. Matcha Latte (`matcha-latte.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: classic iced matcha latte with a smooth swirl gradient of creamy white milk and vibrant green Japanese matcha, clear ice cubes visible throughout. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

---

### Nhóm 3: Trà Trái Cây (REFRESH)

#### 9. Trà Bưởi (`tra-buoi.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: refreshing iced golden-pink tea with clear ice cubes, generously topped with fresh juicy pink pomelo pulp segments (tép bưởi hồng tươi). Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 10. Trà Cam Quýt (`tra-cam-quyt.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: vibrant amber-orange iced citrus tea with ice cubes, garnished with a slice of fresh orange and mandarin citrus wedges. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 11. Trà Vải Hoa Hồng (`tra-vai-hoa-hong.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: delicate blush pink iced floral tea with clear ice cubes, topped with peeled juicy whole white lychee fruits and a few delicate dried pink rose petals. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 12. Trà Lựu Đỏ Habicus (`tra-luu-do-habicus.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: deep ruby-red hibiscus iced tea with sparkling clear ice cubes, topped with fresh red pomegranate seeds and a thin slice of lime. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 13. Trà Chanh Dây Nhiệt Đới (`tra-chanh-day-nhiet-doi.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: bright golden-yellow iced tropical tea with clear ice cubes and authentic black passion fruit seeds floating in the vibrant yellow tea. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 14. Trà Dưa Lưới (`tra-dua-luoi.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: refreshing pale green iced melon tea with clear ice cubes, garnished with small round fresh cantaloupe / honeydew melon balls on top. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 15. Trà Đào Cam Sả (`tra-dao-cam-sa.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: classic Vietnamese iced peach lemongrass tea with amber color, clear ice cubes, sliced yellow peach wedges, a slice of fresh orange, and a fragrant lemongrass stalk tip. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 16. Trà Tắc (`tra-tac.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: traditional Vietnamese iced kumquat tea with golden-amber tea color, clear ice cubes, and freshly cut halved green and orange kumquats floating on top. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 17. Trà Chanh Dây Chôm Chôm (`tra-chanh-day-chom-chom.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: bright golden passion fruit iced tea with passion fruit seeds, topped with peeled whole juicy sweet rambutan fruits (chôm chôm) and clear ice cubes. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 18. Trà Đào Lựu Đỏ (`tra-dao-luu-do.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: layered iced fruit tea with deep red pomegranate juice and amber tea, clear ice cubes, topped with sliced yellow peach wedges and red pomegranate seeds. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 19. Trà Xoài Yakult (`tra-xoai-yakult.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: creamy pastel orange-yellow iced beverage made of Yakult probiotic yogurt blended with sweet mango puree, clear ice cubes visible. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 20. Trà Me (`tra-me.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: traditional Vietnamese iced tamarind drink (đá me) with rich brownish-amber tea color, crushed ice, cooked tamarind pulp, and crunchy roasted peanuts sprinkled on top. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 21. Trà Dâu (`tra-dau.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: bright ruby-red iced strawberry tea with clear ice cubes, topped with slices and halves of fresh red ripe strawberries. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

#### 22. Trà Việt Quất (`tra-viet-quat.jpg`)
```text
A single plain unprinted completely transparent plastic takeaway cup standing centered on an empty, warm beige studio background with soft diagonal window blind shadow lines. Inside: deep purple-violet iced blueberry tea with clear ice cubes, generously garnished with plump whole fresh dark blueberries floating on top. Clean plain cup with NO logo, NO brand name, NO text. Absolutely NO hands, NO people, NO cafe background, NO wooden table. Realistic studio catalog menu photography.
```

---

## 3. Cách Sử Dụng File Ảnh Sau Khi Tạo

Khi bạn tạo xong ảnh từ Midjourney, DALL-E hoặc Gemini:
1. Lưu ảnh theo đúng tên file tương ứng (ví dụ `tra-dao-cam-sa.jpg`).
2. Kéo thả hoặc copy trực tiếp vào thư mục:
   `public/images/drinks/`
3. Website sẽ tự động nhận diện và hiển thị ảnh độ nét cao ngay lập tức mà không cần chỉnh sửa bất kỳ dòng code nào.
