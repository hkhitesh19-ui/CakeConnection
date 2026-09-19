import { useState, useEffect } from 'react';
import { getProductsByCategory, getAllProducts } from '@/lib/db';
import type { Product } from '@/types';

export function useProducts(category: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const result = category
          ? await getProductsByCategory(category as Product['category'])
          : await getAllProducts();
        setProducts(result);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to fetch products');
      }
      setLoading(false);
    }

    fetchProducts();
  }, [category]);

  return { products, loading, error };
}
