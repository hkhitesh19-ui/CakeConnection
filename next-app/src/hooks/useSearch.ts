// ============================================
// AI-Powered Search Hook — Cake Connection
// ============================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

// ============================================
// Types
// ============================================

export interface SearchFilters {
  maxPrice?: number;
  minPrice?: number;
  category?: 'cakes' | 'flowers' | 'combos';
  tags?: string[];
  isBestseller?: boolean;
  isEggless?: boolean;
  isNewArrival?: boolean;
  weight?: string;
}

export interface ParsedQuery {
  cleanQuery: string;
  filters: SearchFilters;
}

export interface UseSearchReturn {
  results: Product[];
  suggestions: Product[];
  recentSearches: string[];
  isLoading: boolean;
  activeFilters: SearchFilters;
  search: (query: string) => void;
  getSuggestions: (query: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  clearResults: () => void;
}

// ============================================
// Constants
// ============================================

const RECENT_SEARCHES_KEY = 'cake-connection-recent-searches';
const MAX_RECENT_SEARCHES = 8;
const MAX_SUGGESTIONS = 8;
const MAX_RESULTS = 20;
const PRODUCT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ============================================
// Query Parser — Natural Language → Filters
// ============================================

export function parseSearchQuery(rawQuery: string): ParsedQuery {
  let query = rawQuery.trim();
  const filters: SearchFilters = {};

  // --- Price extraction ---
  // "under 500", "below 1000", "upto 800", "up to 800"
  const underPriceRegex = /\b(?:under|below|upto|up\s*to|less\s*than|max)\s*(?:₹|rs\.?|inr)?\s*(\d+)\b/gi;
  let priceMatch = underPriceRegex.exec(query);
  if (priceMatch) {
    filters.maxPrice = parseInt(priceMatch[1], 10);
    query = query.replace(priceMatch[0], '');
  }

  // "above 300", "over 500", "more than 300", "min 500", "starting 300"
  const abovePriceRegex = /\b(?:above|over|more\s*than|min|minimum|starting|from)\s*(?:₹|rs\.?|inr)?\s*(\d+)\b/gi;
  priceMatch = abovePriceRegex.exec(query);
  if (priceMatch) {
    filters.minPrice = parseInt(priceMatch[1], 10);
    query = query.replace(priceMatch[0], '');
  }

  // "₹500" or "rs 500" standalone (interpret as maxPrice)
  const standalonePriceRegex = /\b(?:₹|rs\.?|inr)\s*(\d+)\b/gi;
  priceMatch = standalonePriceRegex.exec(query);
  if (priceMatch && !filters.maxPrice && !filters.minPrice) {
    filters.maxPrice = parseInt(priceMatch[1], 10);
    query = query.replace(priceMatch[0], '');
  }

  // --- Category extraction ---
  const categoryPatterns: { regex: RegExp; category: 'cakes' | 'flowers' | 'combos' }[] = [
    { regex: /\b(?:cake|cakes)\b/gi, category: 'cakes' },
    { regex: /\b(?:flower|flowers|bouquet|bouquets|floral)\b/gi, category: 'flowers' },
    { regex: /\b(?:combo|combos|hamper|hampers|bundle|bundles)\b/gi, category: 'combos' },
  ];

  for (const { regex, category } of categoryPatterns) {
    if (regex.test(query)) {
      filters.category = category;
      // Don't remove category words from query — they're useful for text matching
      break;
    }
  }

  // --- Occasion tags ---
  const occasionPatterns: { regex: RegExp; tag: string }[] = [
    { regex: /\b(?:birthday|bday)\b/gi, tag: 'birthday' },
    { regex: /\b(?:anniversary)\b/gi, tag: 'anniversary' },
    { regex: /\b(?:valentine|valentines|valentine's)\b/gi, tag: 'valentine' },
    { regex: /\b(?:wedding)\b/gi, tag: 'wedding' },
    { regex: /\b(?:congratulations|congrats)\b/gi, tag: 'congratulations' },
    { regex: /\b(?:mother'?s?\s*day)\b/gi, tag: "mother's day" },
    { regex: /\b(?:father'?s?\s*day)\b/gi, tag: "father's day" },
    { regex: /\b(?:diwali)\b/gi, tag: 'diwali' },
    { regex: /\b(?:christmas|xmas)\b/gi, tag: 'christmas' },
    { regex: /\b(?:rakhi|raksha\s*bandhan)\b/gi, tag: 'rakhi' },
  ];

  const tags: string[] = [];
  for (const { regex, tag } of occasionPatterns) {
    if (regex.test(query)) {
      tags.push(tag);
    }
  }
  if (tags.length > 0) {
    filters.tags = tags;
  }

  // --- Flags ---
  // Bestseller
  if (/\b(?:bestseller|best\s*seller|best\s*selling|popular|top\s*rated)\b/gi.test(query)) {
    filters.isBestseller = true;
    query = query.replace(/\b(?:bestseller|best\s*seller|best\s*selling|popular|top\s*rated)\b/gi, '');
  }

  // Eggless
  if (/\b(?:eggless|egg\s*free|egg-free|vegetarian|veg)\b/gi.test(query)) {
    filters.isEggless = true;
    query = query.replace(/\b(?:eggless|egg\s*free|egg-free|vegetarian|veg)\b/gi, '');
  }

  // New Arrival
  if (/\b(?:new\s*arrival|new\s*arrivals|newly\s*added|latest|new)\b/gi.test(query)) {
    filters.isNewArrival = true;
    query = query.replace(/\b(?:new\s*arrival|new\s*arrivals|newly\s*added|latest)\b/gi, '');
    // Don't remove standalone "new" — too generic
  }

  // --- Weight extraction (for display, not server-side filter) ---
  const weightRegex = /\b(\d+(?:\.\d+)?)\s*(?:kg|kgs)\b|\b(\d+)\s*(?:g|gm|gms|gram|grams)\b|\b(?:half\s*kg)\b/gi;
  const weightMatch = weightRegex.exec(rawQuery); // use rawQuery, not modified query
  if (weightMatch) {
    if (weightMatch[0].toLowerCase().includes('half')) {
      filters.weight = '0.5 kg';
    } else if (weightMatch[1]) {
      filters.weight = `${weightMatch[1]} kg`;
    } else if (weightMatch[2]) {
      filters.weight = `${weightMatch[2]}g`;
    }
  }

  // Clean up the query: remove extra spaces, trim
  const cleanQuery = query
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s+|\s+$/g, '')
    .trim();

  return { cleanQuery, filters };
}

// ============================================
// Relevance Scoring
// ============================================

function computeRelevanceScore(product: Product, searchTerms: string[]): number {
  if (searchTerms.length === 0) return 1; // No text query, all products equal

  let score = 0;
  const name = product.name.toLowerCase();
  const description = product.description.toLowerCase();
  const shortDesc = product.shortDescription?.toLowerCase() || '';
  const flavour = product.flavour?.toLowerCase() || '';
  const subcategory = product.subcategory?.toLowerCase() || '';
  const tags = product.tags.map((t) => t.toLowerCase());

  for (const term of searchTerms) {
    const t = term.toLowerCase();
    if (!t) continue;

    // Exact name match (highest)
    if (name === t) {
      score += 100;
    }
    // Name starts with term
    else if (name.startsWith(t)) {
      score += 60;
    }
    // Name contains term
    else if (name.includes(t)) {
      score += 40;
    }

    // Flavour match
    if (flavour.includes(t)) {
      score += 30;
    }

    // Subcategory match
    if (subcategory.includes(t)) {
      score += 25;
    }

    // Tag match
    if (tags.some((tag) => tag.includes(t))) {
      score += 20;
    }

    // Short description match
    if (shortDesc.includes(t)) {
      score += 15;
    }

    // Full description match
    if (description.includes(t)) {
      score += 10;
    }
  }

  // Bonus for bestseller / featured
  if (product.isBestseller) score += 5;
  if (product.isFeatured) score += 3;

  // Bonus for higher rating
  score += product.rating * 2;

  return score;
}

// ============================================
// Product Cache (module-level singleton)
// ============================================

let cachedProducts: Product[] | null = null;
let cacheTimestamp = 0;

async function fetchAllProducts(): Promise<Product[]> {
  const now = Date.now();

  // Return cache if still fresh
  if (cachedProducts && now - cacheTimestamp < PRODUCT_CACHE_TTL) {
    return cachedProducts;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)');

  if (error) {
    console.error('Error fetching products for search:', error);
    // Return stale cache if available
    return cachedProducts || [];
  }

  if (!data) return [];

  const formatted: Product[] = data.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description || '',
    shortDescription: p.short_description || '',
    category: p.category,
    subcategory: p.subcategory || '',
    flavour: p.flavour,
    images: (p.product_images || [])
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((i: any) => ({ url: i.url, alt: i.alt })),
    variants: (p.product_variants || [])
      .sort((a: any, b: any) => a.price - b.price)
      .map((v: any) => ({
        id: v.id,
        weight: v.weight,
        price: Number(v.price),
        compareAtPrice: v.compare_at_price ? Number(v.compare_at_price) : undefined,
        sku: v.sku,
        stock: v.stock,
      })),
    tags: p.tags || [],
    deliveryOptions: p.delivery_options || [],
    isAvailable: p.is_available,
    isFeatured: p.is_featured,
    isNewArrival: p.is_new_arrival,
    isBestseller: p.is_bestseller,
    rating: Number(p.rating) || 0,
    reviewCount: p.review_count || 0,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));

  cachedProducts = formatted;
  cacheTimestamp = now;

  return formatted;
}

// ============================================
// Client-Side Smart Search
// ============================================

function clientSideSearch(products: Product[], parsedQuery: ParsedQuery): Product[] {
  const { cleanQuery, filters } = parsedQuery;

  let filtered = products.filter((p) => p.isAvailable !== false);

  // --- Apply structured filters ---

  if (filters.category) {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) =>
      p.variants.some((v) => v.price <= filters.maxPrice!)
    );
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) =>
      p.variants.some((v) => v.price >= filters.minPrice!)
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((p) =>
      filters.tags!.some((tag) =>
        p.tags.some((pt) => pt.toLowerCase().includes(tag.toLowerCase()))
      )
    );
  }

  if (filters.isBestseller) {
    filtered = filtered.filter((p) => p.isBestseller);
  }

  if (filters.isEggless) {
    filtered = filtered.filter(
      (p) =>
        p.tags.some((t) => t.toLowerCase().includes('eggless')) ||
        p.flavour?.toLowerCase().includes('eggless') ||
        p.name.toLowerCase().includes('eggless') ||
        p.description.toLowerCase().includes('eggless')
    );
  }

  if (filters.isNewArrival) {
    filtered = filtered.filter((p) => p.isNewArrival);
  }

  // --- Text-based relevance scoring ---
  const searchTerms = cleanQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1); // Skip single-char terms

  if (searchTerms.length > 0) {
    // Only include products that match at least one search term
    const scored = filtered
      .map((product) => ({
        product,
        score: computeRelevanceScore(product, searchTerms),
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, MAX_RESULTS).map(({ product }) => product);
  }

  // No text query but filters applied — return filtered, sorted by rating
  return filtered
    .sort((a, b) => b.rating - a.rating)
    .slice(0, MAX_RESULTS);
}

// ============================================
// Recent Searches (localStorage)
// ============================================

function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecentSearches(searches: string[]): void {
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  } catch {
    console.warn('Failed to save recent searches to localStorage');
  }
}

// ============================================
// useSearch Hook
// ============================================

export function useSearch(): UseSearchReturn {
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecentSearches);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});

  // Debounce timer ref for suggestions
  const suggestionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref to track if component is mounted
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (suggestionTimerRef.current) {
        clearTimeout(suggestionTimerRef.current);
      }
    };
  }, []);

  // --- Search (main search on Enter/submit) ---
  const search = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setActiveFilters({});
      return;
    }

    setIsLoading(true);

    try {
      const parsedQuery = parseSearchQuery(trimmed);
      setActiveFilters(parsedQuery.filters);

      const allProducts = await fetchAllProducts();
      const searchResults = clientSideSearch(allProducts, parsedQuery);

      if (mountedRef.current) {
        setResults(searchResults);
      }
    } catch (err) {
      console.error('Search error:', err);
      if (mountedRef.current) {
        setResults([]);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // --- Suggestions (debounced, as-you-type) ---
  const getSuggestions = useCallback((query: string) => {
    // Clear previous timer
    if (suggestionTimerRef.current) {
      clearTimeout(suggestionTimerRef.current);
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }

    suggestionTimerRef.current = setTimeout(async () => {
      try {
        const allProducts = await fetchAllProducts();
        const lowerQuery = trimmed.toLowerCase();
        const terms = lowerQuery.split(/\s+/).filter((t) => t.length > 1);

        const matches = allProducts
          .filter((p) => {
            const name = p.name.toLowerCase();
            const flavour = p.flavour?.toLowerCase() || '';
            const subcategory = p.subcategory?.toLowerCase() || '';

            // Match if any term appears in name, flavour, or subcategory
            return terms.some(
              (t) =>
                name.includes(t) ||
                flavour.includes(t) ||
                subcategory.includes(t)
            );
          })
          .slice(0, MAX_SUGGESTIONS);

        if (mountedRef.current) {
          setSuggestions(matches);
        }
      } catch {
        if (mountedRef.current) {
          setSuggestions([]);
        }
      }
    }, 200); // 200ms debounce
  }, []);

  // --- Recent Searches ---
  const addRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      // Remove duplicate if exists, add to front
      const updated = [trimmed, ...prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())];
      const limited = updated.slice(0, MAX_RECENT_SEARCHES);
      saveRecentSearches(limited);
      return limited;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    saveRecentSearches([]);
  }, []);

  // --- Clear Results ---
  const clearResults = useCallback(() => {
    setResults([]);
    setSuggestions([]);
    setActiveFilters({});
  }, []);

  return {
    results,
    suggestions,
    recentSearches,
    isLoading,
    activeFilters,
    search,
    getSuggestions,
    addRecentSearch,
    clearRecentSearches,
    clearResults,
  };
}
