# Resolved Errors Log

This document tracks all major bugs/errors encountered in the project, their root causes, how they were resolved, and how to prevent them in the future.

---

## 1. Subcategory Slug Mismatch (e.g., "Father's Day")
**Date:** June 21, 2026
**Issue:** 
Navigating to `http://localhost:3000/cakes?subcategory=fathers-day` showed 0 products, even though products with the "Father's Day Cakes" subcategory existed in Supabase.

**Root Cause:**
The database stored `"Father's Day Cakes"`. When slugified by the frontend, it became `fathers-day-cakes`. The URL filter searched for exactly `fathers-day`, causing the match to fail.

**Resolution:**
Updated the filter logic in `src/app/cakes/page.tsx` and `src/app/flowers/page.tsx`. Added a normalization step that strips `-cakes`, `-cake`, `-flowers`, and `-flower` from the end of database slugs before comparing them to the URL parameter. This allowed `fathers-day-cakes` to perfectly match `fathers-day`.

**Prevention:**
In future architectures, separate the "Display Name" (e.g., "Father's Day Cakes") and the "URL Slug" (e.g., "fathers-day") into two distinct columns in the database. Relying on frontend runtime slugification for routing comparisons leads to fragile matches.

---

## 2. Runtime Error: "Cannot read properties of undefined (reading 'forEach')"
**Date:** June 21, 2026
**Issue:** 
The application crashed with a `TypeError: Cannot read properties of undefined (reading 'forEach')` at `getSubcategories` during page load.

**Root Cause:**
The custom React hook `useProducts` had a split-second initialization state during Server-Side Rendering where the `products` variable was momentarily passed as `undefined` instead of an empty array `[]` into the `getSubcategories` helper.

**Resolution:**
Added a defensive type check (`if (!products || !Array.isArray(products)) return [];`) at the top of the `getSubcategories` function across all category pages to safely catch the empty state.

**Prevention:**
Always use defensive programming (null/undefined checks) when passing asynchronous data or React state to synchronous utility functions that expect arrays.

---

## 3. Next.js Slow Filesystem Warning & File Watcher Overhead
**Date:** June 30, 2026
**Issue:** 
During `next dev`, a warning was thrown: `⚠ Slow filesystem detected. The benchmark took 437ms.` This occurred because the Next.js `.next` build cache was located on a slow network or external `F:` drive, causing high read/write latency.

**Root Cause:**
By default, Next.js writes its cache into the `.next` folder in the current project directory. On a slow drive, this causes extreme slowdowns and triggers Next.js internal warnings.

**Resolution:**
Modified `next.config.ts` to redirect the build cache to a fast local SSD drive (`C:/tmp/cakeconnection-next`) using the `distDir` property. Also disabled `productionBrowserSourceMaps` and adjusted Webpack's `watchOptions` to reduce file system polling overhead. Updated the `dev-clean-start.ps1` script to wipe this new cache location on boot.

**Prevention:**
Keep the Next.js cache directory on the fastest local SSD available (preferably `C:` on Windows) by overriding `distDir` when developing off an external/slow drive.

---

## 4. Next.js ENOENT Error on Boot (Incorrect Path Join)
**Date:** June 30, 2026
**Issue:** 
After fixing the slow filesystem issue, the server crashed on boot with: `Error: ENOENT: no such file or directory, mkdir 'F:\...\next-app\C:\tmp\cakeconnection-next\dev'`.

**Root Cause:**
Used Node's `path.join("C:\\", "tmp", ...)` in `next.config.ts`. Next.js internals interpreted this as a relative path and appended it to the current working directory, resulting in an invalid hybrid path.

**Resolution:**
Replaced `path.join` with an explicit absolute string `"C:/tmp/cakeconnection-next"` (using forward slashes, which Node.js handles natively on Windows). Next.js correctly recognized it as an absolute path outside the project root.

**Prevention:**
When overriding internal directory paths in `next.config.ts` for Windows environments, prefer absolute string declarations with forward slashes instead of relying on `path.join` which can sometimes be misparsed by bundlers.

---

## 5. Mismatch Between Dynamic Slug and Rendered Product Image
**Date:** June 30, 2026
**Issue:** 
Navigating to a specific product slug (e.g., `/cakes/blackforest-cake`) showed the correct title but displayed an incorrect fallback image of a different cake.

**Root Cause:**
A prop-drilling disconnect. The parent server component `[category]/[slug]/page.tsx` correctly fetched the product from Supabase based on the slug and passed it as a prop. However, the child component `ProductDetailClient.tsx` lacked a prop signature for `product`, completely ignored the passed prop, and did a local re-fetch using a mock function `getProductBySlug(slug)` from `@/data/products`. Since the mock data did not have the exact slug, it returned the closest fallback product.

**Resolution:**
Fixed `ProductDetailClient.tsx` by defining the `ProductDetailClientProps` interface to accept `{ product, relatedProducts }`. Removed all local data fetching and mock data imports from the client component, strictly relying on the server-provided data. 

**Prevention:**
Ensure client components accept and utilize data passed from server components instead of independently re-fetching. Check prop interfaces to guarantee the data pipeline isn't broken midway.
