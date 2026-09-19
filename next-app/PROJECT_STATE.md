# Project State & Architecture
**Project:** CakeConnection Next.js Frontend
**Framework:** Next.js 16.2 (Turbopack), React 19, TailwindCSS v4, TypeScript
**Database:** Supabase (mock data fallback via `lib/db.ts`)

## 🛠️ Build & Run Instructions
- **Run Development Server:** `npm run dev`
- **Build Production:** `npm run build`
- **Start Production:** `npm run start`

## 📂 Core Folder Structure
- `src/app/` - Next.js App Router (pages: `/cakes`, `/flowers`, `/combos`, `/admin`)
- `src/components/` - Reusable UI components
- `src/hooks/` - Custom React hooks (`useProducts.ts` handles Supabase fetches)
- `src/lib/` - Utility functions (`db.ts` handles DB connections)
- `src/types/` - TypeScript definitions
- `src/data/` - Static mock data (`products.ts`) - *Being phased out in favor of dynamic API fetches*

## 📜 Session History & Milestones
- **June 2026:**
  1. Transitioned `/cakes`, `/flowers`, and `/combos` pages from static `data/products.ts` imports to dynamic `useProducts` hook fetching real Supabase data.
  2. Implemented `slugify` logic to map URL parameters (e.g. `fathers-day`) to DB strings (e.g. `Father's Day Cakes`).
  3. Resolved "forEach" undefined TypeErrors by adding defensive array checks.
  4. Updated `/api/admin/products/route.ts` to support querying by slug.
  5. Established automatic error documentation (`Resolved_Errors.md`) and project state tracking to maintain ultra low-token context.
  6. Implemented a standalone backend API route (`/api/order/send-invoice`) utilizing `pdfkit` for in-memory invoice generation and `nodemailer` for dual email dispatching (Customer + Admin).
  7. Integrated the `/api/order/send-invoice` API into the Frontend Checkout component (`src/app/checkout/page.tsx`) to automatically dispatch invoices upon successful Razorpay, fallback, and COD order placements.
