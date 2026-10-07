# Graph Report - CakeConnection-project-June2026  (2026-06-13)

## Corpus Check
- 129 files · ~765,772 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 791 nodes · 1306 edges · 83 communities (61 shown, 22 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 44 edges
2. `Container()` - 38 edges
3. `useUIStore` - 37 edges
4. `useCartStore` - 30 edges
5. `useWishlistStore` - 25 edges
6. `formatPrice()` - 22 edges
7. `useSiteStore` - 18 edges
8. `Product` - 16 edges
9. `compilerOptions` - 16 edges
10. `Next.js Migration - Troubleshooting & Error Log` - 14 edges

## Surprising Connections (you probably didn't know these)
- `AdminCustomersAndReviews()` --calls--> `useUIStore`  [EXTRACTED]
  next-app/src/app/admin/customers/page.tsx → next-app/src/stores/uiStore.ts
- `AdminOrders()` --calls--> `useUIStore`  [INFERRED]
  next-app/src/app/admin/orders/page.tsx → next-app/src/stores/uiStore.ts
- `FilterCheckbox()` --calls--> `cn()`  [EXTRACTED]
  next-app/src/app/cakes/page.tsx → next-app/src/utils/index.ts
- `FormInput()` --calls--> `cn()`  [EXTRACTED]
  next-app/src/app/checkout/page.tsx → next-app/src/utils/index.ts
- `PaymentOption()` --calls--> `cn()`  [EXTRACTED]
  next-app/src/app/checkout/page.tsx → next-app/src/utils/index.ts

## Import Cycles
- None detected.

## Communities (83 total, 22 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.24
Nodes (14): addReview(), getAllProducts(), getFeaturedProducts(), getProductById(), getProductBySlug(), getProductsByCategory(), getRelatedProducts(), getReviewsByProductId() (+6 more)

### Community 1 - "Community 1"
Cohesion: 0.22
Nodes (6): BestsellerCarousel(), BestsellerCarouselProps, ComboGifts(), FeaturedBouquets(), FeaturedCakes(), useProducts()

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (16): ParsedQuery, SearchFilters, useSearch(), UseSearchReturn, cardVariants, CATEGORY_EMOJI, CATEGORY_ICONS, chipVariants (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.28
Nodes (7): getProductById(), getRelatedProducts(), cardVariants, fadeUp, pageVariants, WishlistCard(), WishlistPage()

### Community 4 - "Community 4"
Cohesion: 0.18
Nodes (3): AdminSettings(), Facebook(), Instagram()

### Community 5 - "Community 5"
Cohesion: 0.43
Nodes (6): debounce(), generateSlug(), getCloudinaryUrl(), getWhatsAppLink(), prefersReducedMotion(), truncateText()

### Community 6 - "Community 6"
Cohesion: 0.27
Nodes (5): apiConfig, api, ApiClient, ApiError, ApiResponse

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (12): CakesPageContent(), cardVariants, fadeUp, FilterCheckbox(), FilterSidebar(), FLAVOUR_OPTIONS, getSubcategories(), pageVariants (+4 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (35): 1.1 Next.js Metadata Setup — `app/layout.tsx`, 1.2 Sitemap — `app/sitemap.ts`, 1.3 Robots.txt — `app/robots.ts`, 2.1 Sitewide JSON-LD — `components/schema/OrganizationSchema.tsx`, 2.2 Product Schema — `components/schema/ProductSchema.tsx`, 2.3 FAQ Schema — `components/schema/FAQSchema.tsx`, 2.4 BreadcrumbList Schema — `components/schema/BreadcrumbSchema.tsx`, 3.1 Page Structure Template (+27 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (34): dependencies, framer-motion, gsap, @gsap/react, @hookform/resolvers, lucide-react, next, react (+26 more)

### Community 11 - "Community 11"
Cohesion: 0.09
Nodes (15): cardVariants, CombosPageContent(), fadeUp, FilterCheckbox(), FilterSidebar(), getSubcategories(), pageVariants, PRICE_RANGES (+7 more)

### Community 12 - "Community 12"
Cohesion: 0.05
Nodes (30): fadeUp, MOCK_ADDRESSES, MOCK_USER, pageVariants, TABS, TabType, CITY_DATA, GeoDeliveryPage() (+22 more)

### Community 13 - "Community 13"
Cohesion: 0.32
Nodes (11): ProductCard(), ProductCard(), ProductCard(), BestsellersSection(), ProductPage(), RelatedProductCard(), RelatedProductCard(), useCartStore (+3 more)

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (4): handleMouseEnter(), handleToppingToggle(), playBeep(), selectFlavor()

### Community 15 - "Community 15"
Cohesion: 0.09
Nodes (29): geistMono, geistSans, metadata, RootLayout(), cloudinaryConfig, MegaMenuItem, MegaMenuSection, NavCategory (+21 more)

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (3): SLIDES, startTimer(), stopTimer()

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (21): ClosedDate, DEFAULT_DELIVERY_BANNER, DEFAULT_DELIVERY_SPEEDS, DEFAULT_FAQS, DEFAULT_HERO, DEFAULT_SEO, DEFAULT_SETTINGS, DEFAULT_SLOTS (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 21 - "Community 21"
Cohesion: 0.22
Nodes (9): Badge(), BadgeProps, sizeStyles, variantStyles, Logo(), ProductCardSkeleton(), ProductGridSkeleton(), Skeleton() (+1 more)

### Community 22 - "Community 22"
Cohesion: 0.11
Nodes (13): DELIVERY_SPEED_OPTIONS, DeliverySpeedOption, FLAVOUR_OPTIONS, FlavourOption, PriceBreakdown, TIME_SLOTS, WEIGHT_OPTIONS, WeightOption (+5 more)

### Community 23 - "Community 23"
Cohesion: 0.15
Nodes (14): CartState, WishlistState, Address, Cart, CartItem, Order, OrderStatus, PaymentMethod (+6 more)

### Community 25 - "Community 25"
Cohesion: 0.13
Nodes (14): 10. Hydration Mismatch on Checkout Page (`formatPrice(subtotal)` / Items List), 11. `TypeError: navigate is not a function` on Checkout Page, 12. `Type error: Property 'env' does not exist on type 'ImportMeta'` in Checkout Page, 13. SearchOverlay Navigation Crash (Missing React Router Context), 1. `Module not found: Can't resolve '@/hooks/useProducts'` (and `siteStore`), 2. `Failed prop type: The prop href expects a string or object in <Link>, but got undefined instead`, 3. `Hydration failed because the server rendered HTML didn't match the client`, 4. `TypeError: onComplete is not a function` (+6 more)

### Community 26 - "Community 26"
Cohesion: 0.40
Nodes (3): GET(), POST(), GET()

### Community 27 - "Community 27"
Cohesion: 0.16
Nodes (10): cardVariants, fadeUp, FilterCheckbox(), FilterSidebar(), FlowersPageContent(), getSubcategories(), pageVariants, PRICE_RANGES (+2 more)

### Community 29 - "Community 29"
Cohesion: 0.24
Nodes (5): allCountries, Country, popularCountries, CountryCodeSelectProps, CountryRowProps

### Community 31 - "Community 31"
Cohesion: 0.25
Nodes (6): allProducts, cakeProducts, comboProducts, { createClient }, flowerProducts, supabase

### Community 33 - "Community 33"
Cohesion: 0.18
Nodes (12): HomePage(), metadata, DeliveryBanner(), FAQ(), faqData, FAQItem, FooterCTA(), galleryItems (+4 more)

### Community 36 - "Community 36"
Cohesion: 0.15
Nodes (12): 10. Pending / Next Steps, 11. Working Agreements / Preferences, 1. Project Overview, 2. Tech Stack, 3. Repository Structure (key paths), 4. Pricing Rules (VERIFIED — do not change without re-confirming), 5. Checkout / Order Flow, 6. Required Supabase `orders` table columns (+4 more)

### Community 37 - "Community 37"
Cohesion: 0.08
Nodes (21): metadata, BirthdayCakeVadodara(), faqs, metadata, EgglessCakeVadodara(), faqs, metadata, faqs (+13 more)

### Community 39 - "Community 39"
Cohesion: 0.23
Nodes (7): allProducts, flowerProducts, MockReview, mockReviews, scrapedFlowerProducts, scrapedCakeProducts, Product

### Community 41 - "Community 41"
Cohesion: 0.18
Nodes (6): cardVariants, fadeIn, fadeInUp, getCategoryLabel(), ProductDetailClient(), staggerContainer

### Community 42 - "Community 42"
Cohesion: 0.18
Nodes (8): CheckoutPage(), fadeUp, FormData, FormInput(), pageVariants, PaymentOption(), slideVariants, VADODARA_AREAS

### Community 43 - "Community 43"
Cohesion: 0.14
Nodes (6): CATEGORIES, MUST_HAVE_ITEMS, OCCASIONS, Container(), ContainerProps, sizeStyles

### Community 44 - "Community 44"
Cohesion: 0.33
Nodes (6): AdminCoupons(), CouponForm, AdminOrders(), Toast, UIState, useUIStore

### Community 46 - "Community 46"
Cohesion: 0.24
Nodes (7): BouquetCard(), BouquetProduct, cardVariants, formatPrice(), getDiscountPercent(), headingVariants, sectionVariants

### Community 47 - "Community 47"
Cohesion: 0.24
Nodes (7): CakeCard(), CakeProduct, cardVariants, formatPrice(), getDiscountPercent(), headingVariants, sectionVariants

### Community 48 - "Community 48"
Cohesion: 0.32
Nodes (7): CartItemCard(), CartPage(), Coupon, fadeUp, itemVariant, pageVariants, formatPrice()

### Community 50 - "Community 50"
Cohesion: 0.38
Nodes (4): AdminCustomersAndReviews(), CustomerData, ReviewData, supabase

### Community 51 - "Community 51"
Cohesion: 0.29
Nodes (5): cardVariants, headingVariants, NavCard, occasions, recipients

### Community 52 - "Community 52"
Cohesion: 0.47
Nodes (4): getProductBySlug(), ProductPage(), generateMetadata(), Props

### Community 54 - "Community 54"
Cohesion: 0.40
Nodes (4): 1. Checkout Navigation Error, 2. Next.js Image Unconfigured Local Patterns, 3. Server Connection Refusal, Resolved Errors & Issues Pipeline

### Community 55 - "Community 55"
Cohesion: 0.50
Nodes (3): cardVariants, PromoBanner, promoBanners

### Community 56 - "Community 56"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **301 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+296 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Container()` connect `Community 43` to `Community 1`, `Community 3`, `Community 7`, `Community 11`, `Community 12`, `Community 13`, `Community 14`, `Community 15`, `Community 17`, `Community 21`, `Community 22`, `Community 27`, `Community 33`, `Community 37`, `Community 41`, `Community 42`, `Community 45`, `Community 46`, `Community 47`, `Community 48`, `Community 51`, `Community 55`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 13` to `Community 2`, `Community 3`, `Community 5`, `Community 7`, `Community 41`, `Community 42`, `Community 11`, `Community 12`, `Community 43`, `Community 46`, `Community 47`, `Community 48`, `Community 14`, `Community 15`, `Community 21`, `Community 22`, `Community 27`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `useUIStore` connect `Community 44` to `Community 3`, `Community 4`, `Community 7`, `Community 41`, `Community 42`, `Community 11`, `Community 13`, `Community 46`, `Community 47`, `Community 48`, `Community 15`, `Community 50`, `Community 22`, `Community 27`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `cn()` (e.g. with `ProductPage()` and `OrderCard()`) actually correct?**
  _`cn()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `useUIStore` (e.g. with `ProductPage()` and `AdminOrders()`) actually correct?**
  _`useUIStore` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `useWishlistStore` (e.g. with `ProductPage()` and `RelatedProductCard()`) actually correct?**
  _`useWishlistStore` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _301 weakly-connected nodes found - possible documentation gaps or missing edges._