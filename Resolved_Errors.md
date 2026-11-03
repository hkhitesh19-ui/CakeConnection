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



---

## 6. Admin Panel Price Updates Not Reflecting on Main Website (Static Bundle Isolation)
**Error Signature:**
Admin Panel (`/admin/cakes`) par jab bhi admin kisi cake ke prices change karke Save karta tha, toh changes server par `products-store.json` me save ho jate the aur Admin Panel me naye price dikhte the. Lekin main customer website (`/cakes` aur product pages) par hamesha purane prices hi display hote rehte the.

**Root Cause:**
1. Next.js production build (`npm run build`) ke time client components (jaise `cakes/page.tsx` aur home carousels) static mock data array `allProducts` (from `@/data/products.ts`) ko JavaScript client bundle me hardcode (bake) kar lete the.
2. `useProducts` hook client browser me run hota tha aur bina kisi network request ke browser memory se hi static `allProducts` filter karke render kar deta tha.
3. Server par `products-store.json` update hone ke baad bhi client browser kabhi server se fresh products mangta hi nahi tha.

**Technical Term:**
**Client-Side Dynamic Revalidation (Stale-While-Revalidate / SWR Hydration)** vs **Build-Time Static Bundle Freezing**.

**Resolution & Permanent SOP:**
1. **Public Dynamic API Created:** `src/app/api/products/route.ts` (`export const dynamic = 'force-dynamic';`) jo server-side `serverProductStore.ts` se merged live catalog (`products-store.json` + base catalog) return karta hai.
2. **Dynamic Client Hook:** `src/hooks/useProducts.ts` ab `/api/products` se dynamic live prices fetch karta hai (`cache: 'no-store'`). Zero-flicker ke liye initial state instant load hoti hai aur background me dynamic live prices se hydrate ho jati hai.
3. **Dynamic Product Detail Page:** `src/app/[category]/[slug]/page.tsx` me `getMergedProductBySlug` direct server-side evaluate hota hai with `force-dynamic`.
4. **Outcome:** Ab jab bhi Admin Panel par koi bhi price, weight variant ya stock edit hoga, main website par wo **instantly live** reflect hoga bina kisi manual redeployment ya server rebuild ke.

---

## 7. Premature "Task Done" Reply Without End-to-End Visual QC Check (Hidden Fallback Overrides)
**Error Signature:**
Admin Panel me sabhi cakes ke `Bestseller` aur `2-Hr Express` flags de-select karke Save karne ke baad, database aur API me count `0 (Zero)` ho gaya tha. Agent ne API verify karke user ko reply de diya ki "Sab De-select ho gaya", lekin live website (`cakeconnection.in`) ke homepage par wahi purane cakes abhi bhi "2 Hours Delivery" aur "Bestselling Cakes" me display ho rahe the.

**Root Cause:**
Frontend carousel components (`FastDeliveryCarousel.tsx` aur `BestsellerCarousel.tsx`) ke andar hardcoded fallback laga hua tha:
1. `FastDeliveryCarousel`: `filteredProducts.length > 0 ? filteredProducts : mockProducts` (where `mockProducts = cakeProducts.slice(0, 8)`).
2. `BestsellerCarousel`: `(bestsellers.length > 0 ? bestsellers : availableProducts).slice(0, 12)`.
Jab Admin ne sabhi cakes de-select kiye aur count 0 hua, toh component ne 0 cakes dikhane ki bajaye chupke se fallback run karke catalog ke pehle 12 cakes zabardasti screen par render kar diye.

**Resolution:**
1. Components se fake fallbacks (`mockProducts`, `availableProducts`) permanently delete kiye gaye.
2. Agar Admin ne 0 cakes select kiye hain (`products.length === 0`), component strictly `return null;` karta hai taaki koi bhi fake ya unapproved cake display na ho.

---

## 8. STRICT PROTOCOL: Mandatory Double Verification QC Check (End-to-End Visual Layer Verification)
**STRICT GLOBAL RULE FOR ANTIGRAVITY & ANY DEVELOPER:**
Kabhi bhi kisi bhi task, bug-fix, ya feature ko "DONE / HO GAYA" bolne se pehle **DOUBLE VERIFICATION QC CHECK** mandatory hai:

1. **Layer 1 — Data & Backend Verification:**
   - Database / Store (`products-store.json`) check karein.
   - API endpoints (`/api/...`) ke response codes aur exact payloads verify karein.

2. **Layer 2 — Consumer UI & Visual Layer Verification (MANDATORY):**
   - Sirf API response dekh kar reply dena SAKHT MANA HAI.
   - Rendered frontend component code, active query params, fallback branches, aur live server HTML/DOM me verify karein ki customer ko screen par wahi dikh raha hai jo hona chahiye.
   - Check karein ki koi hardcoded fallback (`mockData`, `fallbackProducts`, default ternary fallback) actual database selection ko override toh nahi kar raha.
   - Jab tak dono layers (Backend + Frontend DOM) 100% physically match na karein, tab tak task ko "Done" report nahi karna hai.
