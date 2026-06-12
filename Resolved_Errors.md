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
