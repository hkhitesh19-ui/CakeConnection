# Resolved Errors & Issues Pipeline

This document acts as a dedicated log of critical errors encountered during development and exactly how they were successfully resolved.

## 1. Checkout Navigation Error
**Error Signature:**
`Runtime TypeError: navigate is not a function at CheckoutPage.useEffect`

**Root Cause:**
In Next.js App Router, the `useRouter()` hook from `next/navigation` returns an object containing navigation methods, rather than being a callable function directly like it was in older React Router versions.

**Resolution:**
Updated `navigate('/cart')` to `navigate.push('/cart')` inside the `f:\Cake_Connection_Website_May2026\next-app\src\app\checkout\page.tsx` file.

---

## 2. Next.js Image Unconfigured Local Patterns
**Error Signature:**
`Image with src "/logo.png?v=new1" is using a query string which is not configured in images.localPatterns.`

**Root Cause:**
Next.js's `<Image />` component strictly prohibits arbitrary query parameters on local file paths by default to prevent unexpected caching or server rendering behavior. Attempting to force an override via `next.config.ts` (`localPatterns` array) resulted in Turbopack compilation freezing entirely due to aggressive internal caching loops.

**Resolution:**
The absolute best and permanent fix was entirely stripping the manual `?v=new1` cache-busting query parameter from the component itself located in `f:\Cake_Connection_Website_May2026\next-app\src\components\home\LoadingScreen.tsx`. Next.js does not need manual cache-busting on local images because it automatically generates its own optimized URLs (e.g., `/_next/image?...`) securely.

---

## 3. Server Connection Refusal
**Error Signature:**
`http://localhost:3000/ : This site can’t be reached. localhost refused to connect. ERR_CONNECTION_REFUSED`

**Root Cause:**
Because of the complex `localPatterns` configuration added to `next.config.ts` during the previous error fix, Next.js Turbopack took an extraordinarily long time (over 84 seconds) to compile the initial chunk, ultimately freezing the local development server and dropping incoming browser requests.

**Resolution:**
1. Force-killed the frozen server process running on Port 3000.
2. Removed the problematic `localPatterns` config completely from `f:\Cake_Connection_Website_May2026\next-app\next.config.ts`.
3. Performed a clean cold start of the `npm run dev` server which restored full connectivity instantly.

---

## 4. Price Mismatch Between Listing and Product Detail Page
**Error Signature:**
Live website par listing page (`/cakes`) par same cake ke 500g aur 1kg ke price (e.g., ₹649, ₹1,149) product detail page (`/cakes/[slug]`) ke price (₹549, ₹999) se alag show ho rahe the.

**Root Cause:**
`src/app/cakes/page.tsx` ke `ProductCard` component me code `v.compareAtPrice` ko display kar raha tha (`mrp = (v.compareAtPrice && v.compareAtPrice > 0) ? v.compareAtPrice : v.price`). Database/store (`serverProductStore.ts`) me `compareAtPrice` automatically `price * 1.15` (+15% markup) calculate hota hai. Is wajah se listing cards par 15% inflated MRP dikh raha tha jabki detail page actual selling price `v.price` dikha raha tha.

**Resolution:**
`src/app/cakes/page.tsx` ko update kiya gaya taaki `mrp = Number(v.price) || 0` use ho. Ab dono pages par selling price bilkul identical show hoti hai.

---

## 5. Order Confirmation Email Localhost URL Leaks
**Error Signature:**
Live customer order place hone ke baad confirmation emails me product links aur summary URLs `http://localhost:3000/...` bankar jaa rahi thi.

**Root Cause:**
Next.js me `NEXT_PUBLIC_*` prefix wale environment variables (jaise `NEXT_PUBLIC_SITE_URL`) build-time par static string replace ho jaate hain. Agar VPS par build run karte waqt environment me fallback ya `.env.local` activate ho gaya tha, toh `localhost:3000` JavaScript production bundle me hardcode ho gaya.

**Technical Term:**
**Runtime Dynamic Environment Variable Resolution** (vs Build-Time Static Inlining / Dead-Code Replacement).

**Non-Technical Term:**
**Automatic Environment Switcher** (Smart Mode Detection).

**Resolution & Prevention SOP:**
1. Server-side API route (`src/app/api/order/send-invoice/route.ts`) me build-time variable ki jagah server runtime variable `SITE_URL` use kiya gaya:
   ```typescript
   const BASE_URL = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://cakeconnection.in').replace(/\/$/, '');
   ```
2. Local dev ke liye `.env.local` me `SITE_URL=http://localhost:3000`.
3. VPS production ke liye `.env.production` me `SITE_URL=https://www.cakeconnection.in`.
4. Server API routes runtime pe dynamic environment read karte hain, isliye kabhi bhi code me manual domain switch karne ki zarurat nahi hoti.

