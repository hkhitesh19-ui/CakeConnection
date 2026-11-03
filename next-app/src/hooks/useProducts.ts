import { useState, useEffect, useMemo } from 'react';
import { getProductsByCategory, getAllProducts } from '@/lib/db';
import type { Product } from '@/types';

export function useProducts(category?: string) {
  // 1. Initial synchronous state from base data for zero-flicker render
  const initialData = useMemo(() => {
    try {
      return category
        ? getProductsByCategory(category as Product['category'])
        : getAllProducts();
    } catch {
      return [];
    }
  }, [category]);

  const [products, setProducts] = useState<Product[]>(() => {
    // If it's a promise (async getAllProducts), start empty or fallback
    return Array.isArray(initialData) ? initialData : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDynamicProducts() {
      try {
        setLoading(true);
        setError(null);

        const url = category
          ? `/api/products?category=${encodeURIComponent(category)}`
          : '/api/products';

        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }

        const json = await res.json();
        if (json.success && Array.isArray(json.data) && isMounted) {
          setProducts(json.data);
        }
      } catch (err: any) {
        // Fallback to local db if API fails or offline
        try {
          const fallback = category
            ? await getProductsByCategory(category as Product['category'])
            : await getAllProducts();
          if (isMounted) {
            setProducts(fallback);
          }
        } catch (fbErr: any) {
          if (isMounted) {
            setError(err.message || 'Failed to fetch products');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDynamicProducts();

    return () => {
      isMounted = false;
    };
  }, [category]);

  return { products, loading, error };
}
