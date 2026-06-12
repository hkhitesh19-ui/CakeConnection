# Graph Report - Cake_Connection_Website_May2026  (2026-06-12)

## Corpus Check
- 116 files · ~764,417 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 303 nodes · 236 edges · 11 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 20|Community 20]]

## God Nodes (most connected - your core abstractions)
1. `isSupabaseConfigured()` - 9 edges
2. `ApiClient` - 8 edges
3. `useProducts()` - 5 edges
4. `playBeep()` - 4 edges
5. `getProductBySlug()` - 4 edges
6. `getProductById()` - 4 edges
7. `getRelatedProducts()` - 4 edges
8. `getReviewsByProductId()` - 4 edges
9. `WhatsAppFAB()` - 3 edges
10. `getProductBySlug()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `loadProductData()` --calls--> `getReviewsByProductId()`  [INFERRED]
  next-app\src\app\product\[slug]\page.tsx → next-app\src\lib\db.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.19
Nodes (11): addReview(), getAllProducts(), getFeaturedProducts(), getProductById(), getProductBySlug(), getProductsByCategory(), getRelatedProducts(), getReviewsByProductId() (+3 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (1): useProducts()

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (1): useSearch()

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (3): getProductById(), getProductBySlug(), getRelatedProducts()

### Community 6 - "Community 6"
Cohesion: 0.36
Nodes (1): ApiClient

### Community 8 - "Community 8"
Cohesion: 0.25
Nodes (2): StoreLayoutWrapper(), WhatsAppFAB()

### Community 12 - "Community 12"
Cohesion: 0.33
Nodes (2): generateFAQSchema(), generateLocalBusinessSchema()

### Community 14 - "Community 14"
Cohesion: 0.43
Nodes (4): handleMouseEnter(), handleToppingToggle(), playBeep(), selectFlavor()

### Community 16 - "Community 16"
Cohesion: 0.4
Nodes (2): handleNextStep(), validateStep1()

### Community 17 - "Community 17"
Cohesion: 0.5
Nodes (2): startTimer(), stopTimer()

### Community 20 - "Community 20"
Cohesion: 0.5
Nodes (1): MegaMenu()

## Knowledge Gaps
- **Thin community `Community 1`** (17 nodes): `handleAddToCart()`, `scroll()`, `handleAddToCart()`, `formatPrice()`, `getDiscountPercent()`, `handleAddToCart()`, `handleWishlistToggle()`, `formatPrice()`, `getDiscountPercent()`, `handleAddToCart()`, `handleWishlistToggle()`, `useProducts()`, `BestsellerCarousel.tsx`, `ComboGifts.tsx`, `FeaturedBouquets.tsx`, `FeaturedCakes.tsx`, `useProducts.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 2`** (17 nodes): `clientSideSearch()`, `computeRelevanceScore()`, `fetchAllProducts()`, `getRecentSearches()`, `parseSearchQuery()`, `saveRecentSearches()`, `useSearch()`, `handleClear()`, `handleEsc()`, `handleInputChange()`, `handleProductClick()`, `handleQuickSearch()`, `handleSearch()`, `handleSuggestionClick()`, `removeRecentSearch()`, `SearchOverlay.tsx`, `useSearch.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (9 nodes): `ApiClient`, `.constructor()`, `.delete()`, `.get()`, `.patch()`, `.post()`, `.put()`, `.request()`, `api.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (8 nodes): `RootLayout()`, `RootLayout()`, `StoreLayoutWrapper()`, `WhatsAppFAB()`, `layout.tsx`, `RootLayout.tsx`, `StoreLayoutWrapper.tsx`, `WhatsAppFAB.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (7 nodes): `page.tsx`, `schema.ts`, `generateBreadcrumbSchema()`, `generateFAQSchema()`, `generateLocalBusinessSchema()`, `generateProductSchema()`, `generateReviewSchema()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (6 nodes): `getTomorrowString()`, `handleNextStep()`, `handlePlaceOrder()`, `updateField()`, `validateStep1()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (5 nodes): `handleNext()`, `handlePrev()`, `startTimer()`, `stopTimer()`, `HeroSection.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (4 nodes): `MegaMenu()`, `fetchCategories()`, `MegaMenu.tsx`, `Navbar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._