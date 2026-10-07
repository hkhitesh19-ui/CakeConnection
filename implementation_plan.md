# Implementation Plan: Winni-Style Mega Menu

Aapke request ke mutabiq, humari main website navigation mein ab sirf 3 categories hongi (Cakes, Flower Bouquets, Combos) aur "Cakes" ka Mega Menu bilkul `Winni.in` jaisa dikhega (columns, trending links, aur promo images ke saath).

## User Review Required

- **Dynamic Categories (Database):** Abhi Navbar categories database (`cake_categories` table) se fetch ho rahi hain jo Winni jaisa complex structure support nahi karti. Hum is dynamic fetching ko disable karke, `site.config.ts` mein defined **static config** use karenge. Isse menu ekdum Winni jaisa dikhega aur super fast load hoga. 
- **Images:** Promo banners ke liye placeholder images use ki jayengi jo baad me admin panel ya config se change ki ja sakengi.

## Proposed Changes

### 1. `src/config/site.config.ts`
- `NavCategory` interface ko update karke usme `trendingLinks` aur `promotions` fields add karenge.
- `navigationConfig` mein "Cakes" category ko update karenge taki usme "Top Trending Links" (Pinata Cakes, Bento Cake, etc.) aur "Promo Banners" (New Arrivals, Premium Cakes) add kiye ja sakein, bilkul Winni ki tarah.
- Main navigation label "Flowers" ko "Flower Bouquets" mein change karenge.

### 2. `src/components/layout/Navbar.tsx`
- `useEffect` mein jo dynamic Supabase fetch tha jo "Cakes" ke mega menu ko overwrite kar raha tha, usko hata denge taaki humara Winni-style static config render ho sake.
- `MegaMenu` component ko call karte waqt poora `navItem` pass karenge instead of just `megaMenu` sections.

### 3. `src/components/layout/MegaMenu.tsx`
- Mega Menu ka layout redesign karke 3 distinct sections banayenge:
  1. **Left Section:** 4-5 Columns ka CSS Grid `item.megaMenu` ke liye (Cakes by Type, Flavour, Theme, Occasion).
  2. **Middle Section:** `trendingLinks` ke liye ek distinct vertical column jisme "Top Trending Links", "All Cakes", aur "Best Seller Cakes" honge.
  3. **Right Section:** `promotions` ke liye ek section jaha par 2 promotional image banners stack hokar display honge (Jaise Winni me 'New Arrivals' aur 'Premium Cakes' hain).
- Styling ko Winni ki tarah bright, clean aur hover effects ke saath premium look denge.

### 4. `src/components/layout/MobileMenu.tsx`
- Mobile menu component ko bhi update karenge taki wo nayi `site.config.ts` fields (`trendingLinks`, `promotions`) ko properly render kare (ya hide kare) taaki mobile experience clean rahe.

## Verification Plan
- Verify that only 3 main categories appear in the Navbar.
- Hover over "Cakes" and verify the layout matches the provided Winni reference image exactly (Columns + Trending + Images).
- Ensure styling uses the brand's aesthetic (`bg-surface-secondary`, `brand-rose` text on hover, etc.) but matches Winni's layout mechanics.
