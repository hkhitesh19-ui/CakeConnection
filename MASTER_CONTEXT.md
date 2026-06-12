# Cake Connection — Master Context Document

> Single source of truth for project state, decisions, and pending work.
> Paste this into a new chat/IDE session to continue without losing context.
> Last updated: 2026-06-12 (IST).

## 1. Project Overview
- **Name:** Cake Connection — e-commerce site for cakes, flowers & gift combos.
- **Market:** Vadodara, Gujarat, India (same-day delivery focus).
- **Status:** ~80% built; pre-deployment hardening in progress.
- **GitLab project:** `cakeconnection-group/CakeConnection-project` (project ID `83111437`).
- **Local path:** `F:\Cake_Connection_Website_May2026`.
- **Default branch:** `main`. Visibility: private.
- **Deploy target (planned):** AWS Amplify (domain migrating Hostinger → AWS).

## 2. Tech Stack
- **Framework:** Next.js 16.2.6 (App Router) + React 19 + TypeScript.
- **Styling:** Tailwind CSS v4.
- **State:** Zustand (with `persist` for cart).
- **Forms/validation:** react-hook-form + Zod.
- **Animation:** GSAP + Framer Motion. **Charts:** Recharts.
- **DB/Auth:** Supabase (Postgres). Client in `next-app/src/lib/supabase.ts`.
- **Payments:** Razorpay (India).

## 3. Repository Structure (key paths)
- `next-app/` — the Next.js app (all app code lives here).
  - `src/app/` — routes (home, cakes, combos, flowers, product/[slug], cart, checkout,
    wishlist, account, orders, about, faq, delivery/[city], 4 SEO landing pages, admin/*).
  - `src/app/api/` — route handlers (admin/products, admin/cms, orders, payments/*).
  - `src/stores/` — `cartStore.ts`, `siteStore.ts`, `uiStore.ts`, `wishlistStore.ts`.
  - `src/utils/` — `index.ts` (formatPrice, cn, slug...), `pricing.ts` (pricing source of truth).
  - `src/lib/` — `supabase.ts`, `db.ts`, `api.ts`, `seo/`.
  - `src/components/` — home, layout, product, seo, schema, ui, conversion.
- `supabase/` — Supabase config/migrations.
- Root docs: `session_summary.md`, `Resolved_Errors.md`, SEO guide, this file.

## 4. Pricing Rules (VERIFIED — do not change without re-confirming)
Single source of truth: `next-app/src/utils/pricing.ts`. Used by BOTH cart and checkout,
and recomputed server-side in `/api/orders`.
- `subtotal = Σ(price × quantity)`
- `deliveryCharge = subtotal >= 999 ? 0 : 49` (pincode override allowed)
- `couponDiscount`: percent → `min(round(subtotal × value / 100), subtotal)`;
  flat → `min(value, subtotal)`; only if `subtotal >= minPurchase`.
- `codCharge = paymentMethod === 'cod' ? 29 : 0`
- `total = max(0, subtotal + deliveryCharge + codCharge − couponDiscount)`
- Razorpay amount = `round(total × 100)` paise; must equal DB-saved total.

## 5. Checkout / Order Flow
1. Cart applies coupon → persisted in cart store (`appliedCoupon`).
2. Checkout reads the same coupon; builds `orderPayload`.
3. `POST /api/orders` → Zod-validates, recomputes pricing server-side, inserts order,
   returns `order_number`, sets `payment_status: pending`.
4. Razorpay: `POST /api/payments/create-order` (paise) → open Razorpay modal →
   `POST /api/payments/verify` (HMAC SHA256 signature) → mark order `paid`.
5. COD: order created directly with pending payment.

## 6. Required Supabase `orders` table columns
`order_number, customer_name, customer_email, customer_phone, sender_whatsapp,
delivery_address (jsonb), items (jsonb), subtotal, delivery_charge, coupon_code,
coupon_discount, cod_charge, total, payment_method, payment_status,
special_instructions, delivery_date, delivery_slot, status,
razorpay_order_id, razorpay_payment_id`.
(Also note: `site_settings` table with `key`/`value` JSON rows drives the CMS/settings.)

## 7. Environment Variables (set in `.env.local` AND AWS Amplify)
See `next-app/.env.example`. Required:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only, if used)
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` (browser), `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` (server)
- Optional: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_WHATSAPP_NUMBER`

## 8. Work Completed
- Verified local code pushed to GitLab.
- Code review of checkout/cart/stores/utils.
- **MR !1** (`fix/pricing-and-order-apis`):
  - Added `pricing.ts` single source of truth; fixed checkout ignoring coupon discount.
  - Cart store persists applied coupon; cart page syncs it.
  - Added API routes: `/api/orders`, `/api/payments/create-order`, `/api/payments/verify`.
  - Server-side total recompute (anti-tamper).
  - Razorpay SDK loaded via `next/script`; env var standardized to `NEXT_PUBLIC_RAZORPAY_KEY_ID`.
  - Added `.env.example`; removed committed secret `Database_Supabase.txt` + `.gitignore` entry.

## 9. Known Resolved Issues (history)
- `navigate is not a function` → use `router.push()` (App Router).
- Next.js Image local query string → removed `?v=...` cache-busting.
- Dev server freeze → removed `localPatterns` from `next.config.ts`.

## 10. Pending / Next Steps
- [ ] **USER ACTION:** Rotate exposed Supabase key + DB password (was in git history).
- [ ] **USER ACTION:** Create/verify Supabase `orders` table (columns in §6).
- [ ] **USER ACTION:** Set all env vars locally + on AWS Amplify (§7).
- [ ] Merge MR !1 after review.
- [ ] Add automated testing + CI: Vitest (unit, esp. `pricing.ts`), Playwright (E2E
      critical path + route smoke tests), `.gitlab-ci.yml` (install→lint→typecheck→build→test→e2e).
- [ ] Verify auth flow (login/signup/logout) + `account` page data.
- [ ] Verify order placement end-to-end against real Supabase.
- [ ] AWS Amplify deployment (build settings, env vars, domain migration).

## 11. Working Agreements / Preferences
- 1000% accuracy on math/logic; verify formulas before applying, no assumptions.
- Token-saving mode: concise, surgical patches.
- Note: GitLab Duo foundational agents (developer flow) returned HTTP 403 — likely a
  Duo seat/tier/permission gap. Re-check before relying on agent delegation.
