# SETUP GUIDE — Energy Passport Web App

## Prerequisites

- Node.js 18+
- npm 9+
- A [Supabase](https://supabase.com) account (free tier works)

---

## Step 1: Install Dependencies

```bash
cd energy-passport-app
npm install
```

---

## Step 2: Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **Never commit `.env.local`** — it is already in `.gitignore`

---

## Step 3: Supabase Project Setup

1. Create a new project at [app.supabase.com](https://app.supabase.com)
2. Copy your project **URL** and **anon key** from:
   - Dashboard → Settings → API

---

## Step 4: Enable Anonymous Auth

**This is required for Guest-First flow.**

1. Go to: **Authentication → Settings → Auth Providers**
2. Under **Anonymous Sign-ins**, toggle ON
3. Save

---

## Step 5: Configure Email Auth (for Passport Claim)

1. Go to: **Authentication → Settings → Auth Providers**
2. Email is enabled by default
3. For production, configure your SMTP in **Authentication → SMTP Settings**

---

## Step 6: Configure Google OAuth (Optional)

1. Create OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com)
2. Add authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
3. In Supabase: **Authentication → Providers → Google**
4. Enter Client ID and Secret

> If not configured: Email auth still works. The Google button appears but will fail gracefully.

---

## Step 7: Run Database Migrations

In Supabase **SQL Editor**, run these files in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_seed_data.sql`

Copy-paste each file's content and click **Run**.

> Alternative: If you have Supabase CLI installed:
> ```bash
> npx supabase db push
> ```

---

## Step 8: Create First Admin User

1. Register an account at `/auth` (email magic link)
2. Get your user ID from Supabase Dashboard → Authentication → Users
3. In SQL Editor, run:

```sql
INSERT INTO admin_users (user_id)
VALUES ('your-user-id-here');
```

4. Now visit `/admin` — you should have access.

---

## Step 9: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Step 10: Production Deployment (Vercel)

### Option A: Vercel Dashboard
1. Push code to GitHub/GitLab
2. Import project in [vercel.com](https://vercel.com)
3. Add environment variables in Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)

### Option B: Vercel CLI
```bash
npx vercel --prod
```

### After Deployment
Update `NEXT_PUBLIC_APP_URL` to your production URL.
If using Google OAuth: Add your Vercel domain to Google OAuth authorized origins.

---

## Verifying Everything Works

### Flow A — New Customer
1. Open `localhost:3000`
2. Click "Chọn trạng thái của bạn"
3. Select fatigue level → desired state
4. See recommendation + micro-action ✓

### Flow B — QR Scan
1. Visit `/scan/wake-americano`
2. Click "Xác nhận — Lưu vào Passport"
3. See success screen + Passport CTA ✓

### Flow C — Claim Passport
1. Visit `/passport` after scan
2. See "Lưu Energy Passport" CTA
3. Enter email → receive magic link ✓

### Flow D — Admin
1. Visit `/admin`
2. If admin: see dashboard ✓
3. Create/edit product → check `/menu` updates ✓

---

## Common Issues

| Issue | Fix |
|-------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` not set | Copy from Supabase Dashboard → Settings → API |
| Anonymous auth fails | Enable Anonymous Auth in Supabase Dashboard |
| Admin redirect to `/` | Ensure your user_id is in `admin_users` table |
| Google OAuth error | Check redirect URI in Google Console matches Supabase callback |
| Build error: missing env | Ensure all `NEXT_PUBLIC_*` vars are set in Vercel |

---

## QR Code Generation

For each product, generate a static QR pointing to:
```
https://your-domain.com/scan/{product-slug}
```

Example:
- `/scan/wake-americano`
- `/scan/focus-matcha-latte`
- `/scan/refresh-peach-tea`

Use any QR generator: [qr-code-generator.com](https://www.qr-code-generator.com) or similar.
Print and attach to cups/packaging.
