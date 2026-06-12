// ============================================
// Database Service — Cake Connection
// Dynamic Supabase data layer with Mock Fallback
// ============================================

import { supabase } from './supabase';
import type { Product, Review } from '@/types';
import { allProducts, mockReviews } from '@/data/products';

// Check if Supabase env parameters are configured and valid
export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(
    url &&
    url !== 'YOUR_SUPABASE_URL' &&
    url !== 'https://placeholder.supabase.co' &&
    key &&
    key !== 'YOUR_SUPABASE_ANON_KEY'
  );
};


// Mapper to translate DB rows into frontend Product objects
function mapProduct(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    description: dbProduct.description,
    shortDescription: dbProduct.short_description || '',
    category: dbProduct.category,
    subcategory: dbProduct.subcategory || '',
    images: Array.isArray(dbProduct.images) ? dbProduct.images : [],
    flavour: dbProduct.flavour,
    tags: Array.isArray(dbProduct.tags) ? dbProduct.tags : [],
    deliveryOptions: Array.isArray(dbProduct.delivery_options) ? dbProduct.delivery_options : [],
    isAvailable: dbProduct.is_available ?? true,
    isFeatured: dbProduct.is_featured ?? false,
    isNewArrival: dbProduct.is_new_arrival ?? false,
    isBestseller: dbProduct.is_bestseller ?? false,
    rating: Number(dbProduct.rating || 0),
    reviewCount: Number(dbProduct.review_count || 0),
    createdAt: dbProduct.created_at || '',
    updatedAt: dbProduct.updated_at || '',
    variants: Array.isArray(dbProduct.product_variants)
      ? dbProduct.product_variants.map((v: any) => ({
          id: v.id,
          weight: v.weight,
          price: Number(v.price),
          compareAtPrice: v.compare_at_price ? Number(v.compare_at_price) : undefined,
          sku: v.sku,
          stock: Number(v.stock),
        }))
      : [],
  };
}

// ── Products API ───────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return allProducts;
  }
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*)');

    if (error) throw error;
    return (data || []).map(mapProduct);
  } catch (err) {
    console.warn('Supabase getAllProducts error, falling back to mock data:', err);
    return allProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) {
    return allProducts.find((p) => p.slug === slug);
  }
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data ? mapProduct(data) : undefined;
  } catch (err) {
    console.warn(`Supabase getProductBySlug(${slug}) error, falling back to mock data:`, err);
    return allProducts.find((p) => p.slug === slug);
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) {
    return allProducts.find((p) => p.id === id);
  }
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? mapProduct(data) : undefined;
  } catch (err) {
    console.warn(`Supabase getProductById(${id}) error, falling back to mock data:`, err);
    return allProducts.find((p) => p.id === id);
  }
}

export async function getProductsByCategory(category: Product['category']): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return allProducts.filter((p) => p.category === category);
  }
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('category', category);

    if (error) throw error;
    return (data || []).map(mapProduct);
  } catch (err) {
    console.warn(`Supabase getProductsByCategory(${category}) error, falling back to mock data:`, err);
    return allProducts.filter((p) => p.category === category);
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return allProducts.filter((p) => p.isFeatured);
  }
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('is_featured', true);

    if (error) throw error;
    return (data || []).map(mapProduct);
  } catch (err) {
    console.warn('Supabase getFeaturedProducts error, falling back to mock data:', err);
    return allProducts.filter((p) => p.isFeatured);
  }
}

export async function getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
  const fallback = allProducts
    .filter((p) => p.id !== productId)
    .slice(0, limit);

  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    const product = await getProductById(productId);
    if (!product) return fallback;

    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('category', product.category)
      .neq('id', productId)
      .limit(limit);

    if (error) throw error;
    return (data || []).map(mapProduct);
  } catch (err) {
    console.warn('Supabase getRelatedProducts error, falling back to mock data:', err);
    return fallback;
  }
}

// ── Reviews API ───────────────────────────────────

export async function getReviewsByProductId(productId: string): Promise<Review[]> {
  const fallback = mockReviews.map(r => ({
    id: r.id,
    productId,
    userId: 'mock-user',
    userName: r.userName,
    rating: r.rating,
    comment: r.comment,
    isVerified: r.isVerified,
    createdAt: r.date,
  }));

  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((r: any) => ({
      id: r.id,
      productId: r.product_id,
      userId: r.user_id || 'anonymous',
      userName: r.user_name,
      rating: r.rating,
      comment: r.comment,
      images: r.images || [],
      isVerified: r.is_verified,
      createdAt: r.created_at,
    }));
  } catch (err) {
    console.warn(`Supabase getReviewsByProductId(${productId}) error, falling back to mock:`, err);
    return fallback;
  }
}

export async function addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review | null> {
  if (!isSupabaseConfigured()) {
    const newReview: Review = {
      ...review,
      id: `r-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    return newReview;
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        product_id: review.productId,
        user_id: review.userId,
        user_name: review.userName,
        rating: review.rating,
        comment: review.comment,
        images: review.images || [],
        is_verified: review.isVerified,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      productId: data.product_id,
      userId: data.user_id,
      userName: data.user_name,
      rating: data.rating,
      comment: data.comment,
      images: data.images || [],
      isVerified: data.is_verified,
      createdAt: data.created_at,
    };
  } catch (err) {
    console.error('Supabase addReview error:', err);
    return null;
  }
}
