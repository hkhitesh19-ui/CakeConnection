import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

export function useProducts(category: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*), product_variants(*)')
        .or(`category.eq.${category},tags.cs.{${category}}`);

      if (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } else if (data) {
        // Map Supabase rows to our frontend Product type
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
              stock: v.stock
            })),
          tags: p.tags || [],
          deliveryOptions: p.delivery_options || [],
          isAvailable: p.is_available,
          isFeatured: p.is_featured,
          isNewArrival: p.is_new_arrival,
          isBestseller: p.is_bestseller,
          rating: Number(p.rating),
          reviewCount: p.review_count,
          createdAt: p.created_at,
          updatedAt: p.updated_at
        }));

        setProducts(formatted);
      }
      setLoading(false);
    }

    fetchProducts();
  }, [category]);

  return { products, loading, error };
}
