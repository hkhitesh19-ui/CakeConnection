# Next.js Migration - Troubleshooting & Error Log

This document maintains a log of all errors encountered during the migration from Vite to Next.js, along with their successful resolutions. This serves as a standard reference for future debugging.

---

### 1. `Module not found: Can't resolve '@/hooks/useProducts'` (and `siteStore`)
**Error Details:**
Next.js threw a build error because it couldn't find the `useProducts` hook or the `siteStore`.
**Resolution:**
- **Cause:** When the Home components were copied from Vite to Next.js, their dependencies (`hooks` and `stores` directories) were missing in the Next.js `src` folder.
- **Fix:** Successfully copied the entire `src/hooks/` and `src/stores/` directories from the root Vite app to the `next-app/src/` folder and restarted the Next.js dev server.

### 2. `Failed prop type: The prop href expects a string or object in <Link>, but got undefined instead`
**Error Details:**
Runtime Error pointing to `Navbar.tsx` and other components that render a `<Link>`.
**Resolution:**
- **Cause:** Vite uses `react-router-dom` where the property is `to="..."`. Next.js uses `next/link` where the property must be `href="..."`. The import was updated, but the property name inside the JSX tags remained `to`.
- **Fix:** Ran a regex replacement across the entire `next-app/src` directory to replace all instances of `to=` with `href=` inside `<Link>` components.

### 3. `Hydration failed because the server rendered HTML didn't match the client`
**Error Details:**
Next.js Hydration Mismatch error at `Navbar.tsx` around the `<motion.span>` showing the `cartCount` and `wishlistCount`.
**Resolution:**
- **Cause:** Zustand stores using `persist` (localStorage) initialize with a default value (e.g., `0`) on the server during SSR. On the client side, they immediately hydrate with the real cart value (e.g., `1`), causing the HTML to mismatch.
- **Fix:** Added an `isMounted` state in `Navbar.tsx`. The `cartCount` and `wishlistCount` UI elements are now only rendered when `isMounted && cartCount > 0`, which completely resolves the SSR hydration conflict.

### 4. `TypeError: onComplete is not a function`
**Error Details:**
Runtime error on the HomePage pointing to `LoadingScreen.tsx:34:7`.
**Resolution:**
- **Cause:** The `LoadingScreen` component strictly expected an `onComplete` prop (used in Vite). However, the Next.js `page.tsx` just rendered `<LoadingScreen />` without passing the function.
- **Fix:** Updated `LoadingScreenProps` to make `onComplete?: () => void` optional, and added a safety check `if (onComplete) onComplete();` before invoking it.

### 5. Persistent Old Logo Cache
**Error Details:**
Even after saving `logo.png` to `next-app/public/logo.png`, the old "CC" monogram and old logo were still showing.
**Resolution:**
- **Cause:** Two issues: Next.js/Browser aggressive caching, and remnants of the "CC" HTML circle inside the Navbar and Footer.
- **Fix:** 
  1. Completely deleted the HTML blocks generating the CSS monogram.
  2. Applied a cache-buster query string `?v=new1` to the `<img src="/logo.png?v=new1" />` tags in Navbar, Footer, and LoadingScreen to forcefully invalidate browser cache.

### 6. `Unterminated regexp literal` on ProductDetailClient.tsx (Blank White Screen)
**Error Details:**
Navigating to any product detail page (e.g. `/cakes/eggless-full-choco-chips-cake`) resulted in a blank white screen due to a Next.js compilation failure.
**Resolution:**
- **Cause:** The migration script that processed `ProductPage.tsx` from Vite to `ProductDetailClient.tsx` in Next.js removed the Vite-specific `<SEOHead>` component. The original page had its JSX wrapped in a fragment (`<> <SEOHead ... /> <main> ... </main> </>`). When `<SEOHead>` was removed, the script removed the opening `<>` fragment tag but left the trailing `</>` tag, causing the JS parser to interpret it as an unterminated regular expression literal and crash compilation.
- **Fix:** Removed the dangling `</>` tag at the end of the return statement in `next-app/src/components/product/ProductDetailClient.tsx`.

### 7. Blurry and Cropped Product Images
**Error Details:**
Scraped product images (e.g. `eggless-full-choco-chips-cake`) appeared blurry and were cropped/cut off at the top and bottom on the product details page.
**Resolution:**
- **Cause:** 
  1. **Blurry:** The scraped product data files referenced low-resolution WordPress thumbnail URLs (e.g. ending in `-247x247.jpg`).
  2. **Cropped/Cut:** The main product image container was styled with a tall aspect ratio (`aspect-[4/5] sm:aspect-[4/4] lg:aspect-[4/5]`) using `object-cover`, which forced the square (1:1) cake photos to be cropped at the top and bottom.
- **Fix:**
  1. Added a post-processing loop at the end of `next-app/src/data/products.ts` to strip the WordPress thumbnail size suffixes (e.g., matching the regex `-\d+x\d+`) from all product image URLs dynamically, restoring them to high-resolution original images.
  2. Modified the main image container in `next-app/src/components/product/ProductDetailClient.tsx` to use `aspect-square`, which aligns with the square aspect ratio of the product photography and displays them without cropping.

### 8. Add to Cart Button Does Not Redirect
**Error Details:**
On the product details page, clicking the "Add to Cart" button successfully added items to the cart but did not redirect the user to the cart page (`/cart`).
**Resolution:**
- **Cause:** Redirection logic was not included in the original Vite app page component after adding the item.
- **Fix:** Added `navigate.push('/cart')` (using the Next.js `useRouter()` hook) inside the `handleAddToCart` function in `next-app/src/components/product/ProductDetailClient.tsx` to automatically redirect the user to the Cart page.

### 9. Checkout Build Error: `Module not found: Can't resolve '@/data/countryData'`
**Error Details:**
Visiting `http://localhost:3000/checkout` caused a Next.js compilation error: `Module not found: Can't resolve '@/data/countryData'` in `CountryCodeSelect.tsx`.
**Resolution:**
- **Cause:** The `countryData.ts` database file was missing in the Next.js project directory.
- **Fix:** Copied the `countryData.ts` file from the original Vite app `src/data/` folder to the Next.js `next-app/src/data/` directory.

### 10. Hydration Mismatch on Checkout Page (`formatPrice(subtotal)` / Items List)
**Error Details:**
Next.js threw a hydration mismatch error on `/checkout` because the server-rendered HTML contained `₹0` (representing an empty cart during server-side SSR) but the client hydrated it with the actual persisted cart total from localStorage (e.g. `₹5,092`).
**Resolution:**
- **Cause:** Zustand stores loaded on the server are empty since they cannot access client-side `localStorage`. When the client hydrates the stored items list and total values, it changes the DOM structure and text, triggering a React hydration mismatch error.
- **Fix:** Added an `isMounted` state in `next-app/src/app/checkout/page.tsx`. The component now renders a loading spinner until it has fully mounted on the client (`isMounted === true`). This ensures the server-rendered DOM matches the initial client paint (both rendering the loading screen) before the client renders the loaded cart details.

### 11. `TypeError: navigate is not a function` on Checkout Page
**Error Details:**
- **Error Type:** Runtime TypeError
- **Error Message:** `navigate is not a function` at `CheckoutPage.useEffect (src/app/checkout/page.tsx:378:7)`
**Resolution:**
- **Cause:** React Router's `useNavigate` hook returns a function (e.g., `navigate('/path')`), but Next.js's `useRouter` returns a router object (where we call `router.push('/path')`). In the checkout code, the hook was imported as `useRouter as useNavigate` and called as `navigate('/cart')`, throwing a type error at runtime.
- **Fix:** Changed the call to `navigate.push('/cart')` on line 378 of `next-app/src/app/checkout/page.tsx`.

### 12. `Type error: Property 'env' does not exist on type 'ImportMeta'` in Checkout Page
**Error Details:**
- **Error Type:** TypeScript Compile/Typechecking Error (Next.js build phase)
- **Location:** `next-app/src/app/checkout/page.tsx:523:47`
**Resolution:**
- **Cause:** Next.js uses Node-style `process.env` variables instead of Vite-style `import.meta.env` variables. Accessing `import.meta.env.VITE_RAZORPAY_KEY_ID` fails TypeScript compilation under Next.js configuration settings.
- **Fix:** Changed the environment variable reference to `process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID` on line 523 of `next-app/src/app/checkout/page.tsx`.

### 13. SearchOverlay Navigation Crash (Missing React Router Context)
**Error Details:**
- **Error Type:** Runtime Navigation Error / Component Crash
- **Location:** `next-app/src/components/layout/SearchOverlay.tsx`
**Resolution:**
- **Cause:** The `SearchOverlay.tsx` component imported `useNavigate` from `react-router-dom`. Because Next.js handles routing server-side/natively and does not wrap components in a `<BrowserRouter>` context, this caused a client-side navigation crash when selecting search results.
- **Fix:** Replaced `useNavigate` from `react-router-dom` with Next.js's `useRouter` from `next/navigation`, and changed all `navigate('/path')` function calls to `router.push('/path')` inside `next-app/src/components/layout/SearchOverlay.tsx`.





