# PROJECT STATUS — Energy Passport Web App

> Last Updated: 2026-09-25 | Phase: 7 QA

---

## DONE ✅

### Phase 1 — Foundation
- [x] Next.js 14 App Router scaffold (TypeScript, Tailwind)
- [x] `@supabase/ssr` + `@supabase/supabase-js` installed
- [x] Supabase server client (`src/lib/supabase/server.ts`)
- [x] Supabase browser client (`src/lib/supabase/client.ts`)
- [x] Next.js middleware (session refresh + admin guard)
- [x] Database migration SQL (`supabase/migrations/001_initial_schema.sql`)
  - 7 tables: profiles, products, micro_actions, state_checkins, consumption_logs, recommendation_events, admin_users
  - Full RLS policies on all tables
  - Indexes, triggers, auto-profile creation
- [x] Seed data SQL (`supabase/migrations/002_seed_data.sql`)
  - 6 products: 2×WAKE, 2×FOCUS, 2×REFRESH
  - 3 micro-actions: 1×WAKE, 1×FOCUS, 1×REFRESH
- [x] TypeScript types (`src/types/index.ts`)
- [x] `.env.example`

### Phase 2 — Public Catalog
- [x] Global CSS design system (WAKE/FOCUS/REFRESH color tokens)
- [x] Root layout (Inter font, Vietnamese locale, SEO metadata)
- [x] Public layout (Header + Footer)
- [x] Header component (mobile hamburger, active nav)
- [x] Landing page (`/`) — WAKE/FOCUS/REFRESH hero, state cards, how-it-works
- [x] Menu page (`/menu`) — grouped by category, DB-first + mock fallback
- [x] Product detail page (`/menu/[slug]`) — caffeine, price, CTA
- [x] CategoryBadge component
- [x] ProductCard component

### Phase 3 — Check-in + Recommendation
- [x] CheckInForm component — 2-step: fatigue + desired state
- [x] Check-in page (`/check-in`) — with URL preselection
- [x] Recommendation engine (`src/lib/recommendation/engine.ts`) — deterministic, data-driven
- [x] Unit tests (`src/lib/recommendation/engine.test.ts`)
- [x] Recommendation page (`/recommendation`) — server-side + client display
- [x] RecommendationClient — product card, micro-action, client-side countdown timer

### Phase 4 — QR + Anonymous Auth + Consumption
- [x] Anonymous Supabase session creation via server action
- [x] Scan page (`/scan/[slug]`) — handles inactive + not found
- [x] ScanConfirmClient — idle/loading/duplicate/success/error states
- [x] Server action `confirmConsumption` — creates log with caffeine snapshot
- [x] Duplicate guard: same product within 5 minutes → warning + confirm override
- [x] `confirmConsumptionDespiteDuplicate` — secondary confirmation

### Phase 5 — Energy Passport + Account Claim
- [x] Passport dashboard (`/passport`) — today caffeine, drink count, timeline
- [x] Claim CTA — appears after ≥1 record, anonymous users only
- [x] Empty state for zero history
- [x] Passport history (`/passport/history`) — grouped by date, per-day caffeine
- [x] Auth page (`/auth`) — claim form
- [x] AuthForm — email magic link + Google OAuth button
- [x] Auth actions (server) — signInWithEmail, signInWithGoogle, signOut
- [x] Auth callback route (`/auth/callback`)
- [x] Sign-out route (`/auth/signout`)

### Phase 6 — Admin
- [x] Admin layout — server-side admin_users check, admin nav
- [x] Admin dashboard (`/admin`) — product/action/log counts
- [x] Products list (`/admin/products`)
- [x] Create product (`/admin/products/new`)
- [x] Edit product (`/admin/products/[id]`)
- [x] Admin product server actions (create, update, soft-delete)
- [x] ProductForm — reusable, all fields including caffeine/price/sort
- [x] Actions list (`/admin/actions`)
- [x] Create action (`/admin/actions/new`)
- [x] Edit action (`/admin/actions/[id]`)
- [x] Admin action server actions (create, update)
- [x] MicroActionForm — step editor (plain text per line)

### Phase 7 — Docs
- [x] `docs/SETUP.md`
- [x] `docs/IMPLEMENTATION_PLAN.md`
- [x] `docs/PROJECT_STATUS.md` (this file)
- [x] `docs/DECISIONS.md`
- [x] `docs/FUTURE_SCOPE.md`

---

## IN PROGRESS 🔄

- [x] Sửa lỗi chính tả URL Supabase trong `.env.local` (`guaa` -> `guea`). Đã kết nối Supabase Cloud thành công.
- [x] Database migration (`001_initial_schema.sql`) và seed data (`002_seed_data.sql`) đã được người dùng thực thi xong.
- [x] Tạo tài liệu kiến trúc chuẩn Product Truth (`PRODUCT_AUDIT.md`, `TARGET_FLOW.md`, `IMPLEMENTATION_PLAN.md`).
- [x] **Nâng cấp UI/UX đạt chuẩn F&B Thương Mại Cao Cấp (Commercial Grade)**:
  - Loại bỏ 100% phone emoji, thay thế bằng bộ bespoke SVG icon & crest (`IconPassportCrest`, `IconStampSeal`, `IconWake`, `IconFocus`, `IconRefresh`, `IconShield`, v.v.).
  - Sinh 4 bộ ảnh chụp thương mại đồ uống độ phân giải cao (`wake-cold-brew.jpg`, `focus-matcha-latte.jpg`, `refresh-fruit-tea.jpg`, `energy-passport-hero.jpg`).
  - Hệ thống Typography tạp chí cao cấp với `Playfair Display` + `Plus Jakarta Sans` tích hợp tối ưu qua `next/font/google`.
  - Palette màu: Obsidian cà phê ấm `#0D0C0A`, vàng gold champagne `#D4AF37`, crema nướng, ngọc lục bảo matcha.
  - Tái thiết kế toàn bộ:
    - **Trang chủ (`/`)**: Hero tạp chí, 3 atelier giải pháp, menu tinh tuyển kèm tasting notes, nghi thức micro-action 10+ & 25+, quy trình 3 bước từ ly nước vật lý tới Passport số.
    - **Energy Passport (`/passport` & `/passport/history`)**: Thiết kế dạng thẻ hội viên da dập chìm + con dấu Visa Barista xác thực thời gian, thước đo liều lượng caffeine chuẩn dược điển.
    - **Thực đơn (`/menu` & `/menu/[slug]`)**: Xóa sạch tag demo, bổ sung tasting notes, xuất xứ hạt, thời điểm khuyên dùng trong ngày.
    - **Check-in (`/check-in`)**: Thang đo somatic 01-05, bỏ emoji, danh từ cảm xúc khách hàng.
    - **Xác nhận QR (`/scan/[slug]`)**: Đóng dấu visa thưởng thức vào Passport.
- [x] Production build hoàn tất thành công (`npm run build`, exit code 0, 17/17 routes).
- [ ] Bật toggle "Enable Anonymous Sign-ins" trên Supabase Dashboard (nếu chưa bật).

---

## NEXT 📋

1. Sửa `CheckInForm.tsx` sang ngôn ngữ khách hàng ("Tỉnh táo hơn", "Tập trung ổn định", "Thư giãn / Làm mới").
2. Bổ sung Section Drinks và Micro-action showcase trên trang chủ (`/`).
3. Hoàn thiện server action `confirmConsumption` để xử lý mượt mà cả khi Supabase Anonymous Auth cần cookie fallback.
4. Tinh chỉnh `linkIdentity` cho flow Claim Passport.
5. Kiểm thử E2E 5 kịch bản chấp thuận (Acceptance Scenarios 1-5).

---

## BLOCKERS 🚧

- [x] ~~Supabase database credentials & migrations~~ (Đã chạy xong).
- [ ] **Bật Anonymous Sign-ins trên Supabase**: Cần vào Supabase Dashboard: **Authentication -> Providers -> Anonymous Sign-ins -> Enable (BẬT)** để API `signInAnonymously()` hoạt động.

---

## KNOWN ISSUES ⚠️

1. Trang `/check-in` ở bước 2 đang hiển thị nhãn "WAKE / FOCUS / REFRESH" thay vì ngôn ngữ cảm xúc của khách hàng.
2. Trang chủ (`/`) thiếu section Featured Drinks và Micro-action Showcase trước section Passport.
3. Flow Claim Passport cần đảm bảo giữ nguyên `user_id` của anonymous guest khi nâng cấp lên email.


### External Setup Required (Manual)
1. Create Supabase project → get URL + anon key
2. Enable Anonymous Auth in Supabase Dashboard
3. Run migration SQL files
4. Seed demo data
5. Create first admin user via SQL

None of these can be automated without credentials.
See `docs/SETUP.md` for exact steps.

---

## MANUAL SETUP REQUIRED ⚙️

| Step | Location |
|------|----------|
| Create `.env.local` from `.env.example` | Root dir |
| Enable Anonymous Auth | Supabase Dashboard |
| Run migration SQL | Supabase SQL Editor |
| Create admin user | Supabase SQL Editor |
| Configure Google OAuth (optional) | Supabase Dashboard + Google Console |

---

## KNOWN ISSUES 🐛

- `useActionState` requires React 19 (included with Next.js 14.3+) — verify with `npm list react`
- Google OAuth requires additional setup per `docs/SETUP.md`
- Caffeine disclaimer appears in footer — may need brand copy adjustment

---

## P1 PENDING (Not in MVP)

- [ ] Better history charts (weekly view)
- [ ] External order links (configurable Grab/ShopeeFood URLs)
- [ ] Admin usage statistics (top products, daily consumption)
- [ ] Polished micro-animations

---

## HOW TO CONTINUE THIS PROJECT

Another AI session can continue by:
1. Reading `docs/IMPLEMENTATION_PLAN.md`
2. Reading this file (`docs/PROJECT_STATUS.md`)
3. Reading `docs/DECISIONS.md`
4. Checking TypeScript errors: `npm run build`
5. Reviewing `src/` structure for current implementation
