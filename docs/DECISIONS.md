# ARCHITECTURAL DECISIONS — Energy Passport

---

## ADR-001: Anonymous Auth via Supabase

**Decision**: Use Supabase Anonymous Auth for guest-first identity.

**Why**: Customers open the site via QR scan on their phone. Any forced login/register wall will lose them immediately. Supabase anonymous auth gives a stable `auth.uid()` that can be upgraded to a permanent account later without losing data. All user tables use `auth.uid()` directly — anonymous and permanent users share identical data model.

**Alternative considered**: localStorage-based guest sessions. **Rejected**: fragile, device-locked, cannot survive browser clears, cannot be claimed.

---

## ADR-002: Static QR Per Product (Not Per Purchase)

**Decision**: QR codes link to `/scan/{product-slug}` — static, product-specific.

**Why**: Dynamic QR (per-order, per-cup) requires integration with POS/inventory systems. That's out of scope for MVP. Static QR with user-confirmed consumption is sufficient. The QR identifies the product; the auth session identifies the user. PURCHASE ≠ CONSUMPTION — user explicitly confirms.

**Alternative considered**: Dynamic QR per sale transaction. **Deferred to FUTURE_SCOPE.md**.

---

## ADR-003: Deterministic Recommendation Engine

**Decision**: Recommendation uses deterministic rules in `lib/recommendation/engine.ts`. No AI/LLM.

**Why**:
- Fully testable (unit tests written)
- Zero API cost
- Explainable results
- Easy to demo
- Business can understand and control it

**Alternative considered**: Gemini API for personalized recommendations. **Deferred to FUTURE_SCOPE.md**.

---

## ADR-004: caffeine_mg_snapshot Immutability

**Decision**: When a consumption is logged, `caffeine_mg_snapshot` is copied from the current product value at that moment and stored immutably in `consumption_logs`.

**Why**: Product caffeine values may be updated by admin. Historical records must reflect what the customer actually drank, not the current product spec. This is both a data integrity and trust issue.

---

## ADR-005: No Payment/Checkout Integration

**Decision**: Website does not process payments or integrate with Grab/ShopeeFood.

**Why**: Customers buy offline, via social media DMs, or via delivery platforms. These platforms are external. The web app's role is recommendation + QR-based consumption tracking. Integrating payments would add massive scope with little MVP value.

**Alternative**: Configurable "purchase CTA" buttons (links to external platforms) — planned as P1.

---

## ADR-006: Admin Authorization via admin_users Table

**Decision**: Admin access is granted by presence in the `admin_users` database table, checked server-side in both middleware and layout.

**Why**: Cannot trust frontend state, localStorage, or query params for authorization. The `admin_users` table is protected by RLS — users can only read their own row. Service role is required to insert (done manually or via setup script). This is simple, secure, and requires no complex RBAC.

---

## ADR-007: Mock Fallback for Development

**Decision**: All data-fetching pages have a `MOCK_PRODUCTS` / `MOCK_ACTIONS` fallback when Supabase is not configured.

**Why**: Developers can see a working UI immediately after `npm run dev` even without Supabase credentials. This accelerates development and demo. Mock data is clearly labeled as `[DEMO]` in product names.

---

## ADR-008: No Separate Guest Session Table

**Decision**: Anonymous users use the same `user_id` from `auth.users` as permanent users.

**Why**: Avoids a dual-model complexity where anonymous data must be migrated to permanent accounts. Supabase's `linkIdentity` upgrades the anonymous user in-place — same `user_id`, same data, no migration needed.
