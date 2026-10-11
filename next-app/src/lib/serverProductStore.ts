import fs from 'fs';
import path from 'path';
import type { Product, ProductVariant } from '@/types';
import { allProducts } from '@/data/products';
import { realCakeProducts } from '@/data/realCakesData';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/db';

export interface ProductOverride {
  id: string;
  name?: string;
  slug?: string;
  isAvailable?: boolean;
  images?: Array<{ url: string; alt?: string }>;
  variants?: Array<{
    id?: string;
    weight: string;
    price: number;
    compareAtPrice?: number | null;
    sku?: string;
    stock?: number;
  }>;
  price?: number;
  category?: string;
  subcategory?: string;
  flavour?: string;
  description?: string;
  shortDescription?: string;
  tags?: string[];
  deliveryOptions?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isDeleted?: boolean;
  updatedAt?: string;
}

export interface ProductUpdateInput {
  productId: string;
  name?: string;
  isAvailable?: boolean;
  photoUrl?: string;
  price250g?: string | number;
  price500g?: string | number;
  price1kg?: string | number;
  price1_5kg?: string | number;
  price2kg?: string | number;
  variants?: any[];
  category?: string;
  subcategory?: string;
  flavour?: string;
  description?: string;
  shortDescription?: string;
  tags?: string[];
  deliveryOptions?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
}

function getStoreFilePath(): string {
  const dir = path.join(process.cwd(), 'src/data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, 'products-store.json');
}

function getRealCakesFilePath(): string {
  return path.join(process.cwd(), 'src/data/realCakesData.ts');
}

/**
 * Load all stored overrides from products-store.json
 */
export function getProductOverrides(): Record<string, ProductOverride> {
  try {
    const filePath = getStoreFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content || '{}');
    }
  } catch (err) {
    console.error('[serverProductStore] Error reading products-store.json:', err);
  }
  return {};
}

/**
 * Save overrides map to products-store.json
 */
export function saveProductOverrides(overrides: Record<string, ProductOverride>): void {
  try {
    const filePath = getStoreFilePath();
    fs.writeFileSync(filePath, JSON.stringify(overrides, null, 2), 'utf-8');
  } catch (err) {
    console.error('[serverProductStore] Error writing products-store.json:', err);
  }
}

/**
 * Sync memory and realCakesData.ts file with updated product
 */
function syncMemoryAndRealCakes(productId: string, updatedOverride: ProductOverride): void {
  // 1. Update in allProducts (in-memory)
  const inAll = allProducts.find((p) => p.id === productId);
  if (inAll) {
    if (updatedOverride.name) inAll.name = updatedOverride.name;
    if (updatedOverride.isAvailable !== undefined) inAll.isAvailable = updatedOverride.isAvailable;
    if (updatedOverride.images) inAll.images = updatedOverride.images as any;
    if (updatedOverride.variants) inAll.variants = updatedOverride.variants as any;
    if (updatedOverride.category) inAll.category = updatedOverride.category as any;
    if (updatedOverride.subcategory) inAll.subcategory = updatedOverride.subcategory;
    if (updatedOverride.flavour) inAll.flavour = updatedOverride.flavour;
    inAll.updatedAt = updatedOverride.updatedAt || new Date().toISOString();
  }

  // 2. Update in realCakeProducts (in-memory & on disk)
  const inReal = realCakeProducts.find((p) => p.id === productId);
  if (inReal) {
    if (updatedOverride.name) inReal.name = updatedOverride.name;
    if (updatedOverride.isAvailable !== undefined) inReal.isAvailable = updatedOverride.isAvailable;
    if (updatedOverride.images) inReal.images = updatedOverride.images as any;
    if (updatedOverride.variants) inReal.variants = updatedOverride.variants as any;
    if (updatedOverride.subcategory) inReal.subcategory = updatedOverride.subcategory;
    if (updatedOverride.flavour) inReal.flavour = updatedOverride.flavour;
    inReal.updatedAt = updatedOverride.updatedAt || new Date().toISOString();

    try {
      const realPath = getRealCakesFilePath();
      if (fs.existsSync(realPath)) {
        fs.writeFileSync(
          realPath,
          `import type { Product } from '@/types';\n\nexport const realCakeProducts: Product[] = ${JSON.stringify(realCakeProducts, null, 2)};\n`,
          'utf-8'
        );
      }
    } catch (err) {
      console.error('[serverProductStore] Error syncing realCakesData.ts:', err);
    }
  }
}

/**
 * Returns merged products combining base catalog with all persistent overrides
 */
export function getMergedProductsList(): any[] {
  const overrides = getProductOverrides();
  const deletedIds = new Set<string>();

  Object.values(overrides).forEach((ov) => {
    if (ov.isDeleted) deletedIds.add(ov.id);
  });

  // Start with allProducts
  const mergedMap = new Map<string, any>();

  allProducts.forEach((p) => {
    if (deletedIds.has(p.id)) return;
    const ov = overrides[p.id];
    if (!ov) {
      mergedMap.set(p.id, { ...p });
      return;
    }

    // Apply override
    const updatedVariants = ov.variants && ov.variants.length > 0 ? ov.variants : p.variants;
    const minPrice = Math.min(...updatedVariants.map((v: any) => v.price).filter((pr: number) => !isNaN(pr) && pr > 0));

    mergedMap.set(p.id, {
      ...p,
      name: ov.name || p.name,
      isAvailable: ov.isAvailable !== undefined ? ov.isAvailable : p.isAvailable,
      images: ov.images && ov.images.length > 0 ? ov.images : p.images,
      variants: updatedVariants,
      price: !isNaN(minPrice) && minPrice < 999999 ? minPrice : p.variants[0]?.price,
      category: ov.category || p.category,
      subcategory: ov.subcategory || p.subcategory,
      flavour: ov.flavour || p.flavour,
      updatedAt: ov.updatedAt || p.updatedAt,
    });
  });

  // Add any completely new products created in overrides
  Object.values(overrides).forEach((ov) => {
    if (ov.isDeleted || mergedMap.has(ov.id)) return;
    mergedMap.set(ov.id, {
      id: ov.id,
      name: ov.name || 'New Cake',
      slug: ov.slug || ov.id,
      description: ov.description || '',
      shortDescription: ov.shortDescription || '',
      category: ov.category || 'cakes',
      subcategory: ov.subcategory || '',
      flavour: ov.flavour || '',
      images: ov.images || [],
      variants: ov.variants || [],
      isAvailable: ov.isAvailable ?? true,
      isFeatured: ov.isFeatured ?? false,
      isNewArrival: ov.isNewArrival ?? false,
      isBestseller: ov.isBestseller ?? false,
      rating: 4.8,
      reviewCount: 25,
      createdAt: new Date().toISOString(),
      updatedAt: ov.updatedAt || new Date().toISOString(),
    });
  });

  return Array.from(mergedMap.values());
}

/**
 * Format merged product to database-like API shape
 */
export function formatToDbProduct(p: any): any {
  const vars = p.variants || p.product_variations || p.product_variants || [];
  const minPrice = Math.min(
    ...vars.map((v: any) => Number(v.price)).filter((pr: number) => !isNaN(pr) && pr > 0)
  );

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    short_description: p.shortDescription || p.short_description || '',
    category: p.category,
    subcategory: p.subcategory || '',
    images: p.images || [],
    flavour: p.flavour || '',
    tags: p.tags || [],
    delivery_options: p.deliveryOptions || p.delivery_options || [],
    is_available: p.isAvailable ?? p.is_available ?? true,
    is_featured: p.isFeatured ?? p.is_featured ?? false,
    is_new_arrival: p.isNewArrival ?? p.is_new_arrival ?? false,
    is_bestseller: p.isBestseller ?? p.is_bestseller ?? false,
    rating: p.rating || 4.8,
    review_count: p.reviewCount || p.review_count || 30,
    price: !isNaN(minPrice) && minPrice < 999999 ? minPrice : (vars[0]?.price ?? 0),
    in_stock: p.isAvailable ?? p.is_available ?? true,
    product_variations: vars.map((v: any) => ({
      id: v.id || `v-${p.slug}-${(v.weight || '').replace(/[^a-zA-Z0-9]/g, '')}`,
      weight: v.weight,
      price: Number(v.price),
      compare_at_price: v.compareAtPrice ?? v.compare_at_price ?? null,
      sku: v.sku || `CK-${p.slug}-${v.weight}`,
      stock: v.stock ?? 100000,
    })),
    created_at: p.createdAt || p.created_at || '2026-06-01',
    updated_at: p.updatedAt || p.updated_at || new Date().toISOString(),
  };
}

/**
 * Save single or multiple product updates permanently to disk and sync memory
 */
export async function saveProductUpdate(input: ProductUpdateInput): Promise<{ success: boolean; data: any; error?: string }> {
  try {
    const overrides = getProductOverrides();
    const productId = input.productId;

    // Find target product
    let target = allProducts.find((p) => p.id === productId || p.slug === productId || p.name === productId);
    if (!target) {
      target = realCakeProducts.find((p) => p.id === productId || p.slug === productId || p.name === productId);
    }

    const existingOv = overrides[productId] || {};
    const existingVariants: any[] = input.variants && input.variants.length > 0
      ? input.variants
      : (existingOv.variants || target?.variants || []);

    const updatedVariants = existingVariants.map((v) => ({ ...v }));

    // Helper for weights
    const updateOrAddWeight = (weightKey: string, priceValue: string | number | undefined, targetWeightLabel: string) => {
      if (priceValue === undefined || priceValue === '') return;
      const numPrice = Number(priceValue);
      if (isNaN(numPrice) || numPrice <= 0) return;

      const normKey = weightKey.toLowerCase();
      const found = updatedVariants.find((v) => {
        const w = (v.weight || '').toLowerCase().trim();
        if (normKey === '1.5kg') return w === '1.5kg' || w.includes('1.5');
        if (normKey === '1kg') return w === '1kg' || w === '1 kg';
        return w.includes(normKey);
      });

      if (found) {
        found.price = numPrice;
      } else {
        const slug = target?.slug || 'cake';
        const newVar = {
          id: `v-${slug}-${normKey}`,
          weight: targetWeightLabel,
          price: numPrice,
          compareAtPrice: Math.round(numPrice * 1.15),
          sku: `CK-${slug}-${normKey.toUpperCase()}`,
          stock: 100000,
        };
        if (normKey === '250g') {
          updatedVariants.unshift(newVar);
        } else {
          updatedVariants.push(newVar);
        }
      }
    };

    updateOrAddWeight('250g', input.price250g, '250g');
    updateOrAddWeight('500g', input.price500g, '500g');
    updateOrAddWeight('1kg', input.price1kg, '1kg');
    updateOrAddWeight('1.5kg', input.price1_5kg, '1.5kg');
    updateOrAddWeight('2kg', input.price2kg, '2kg');

    const prices = updatedVariants.map((v) => Number(v.price)).filter((p) => !isNaN(p) && p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : (target?.variants[0]?.price ?? 0);

    const updatedOverride: ProductOverride = {
      ...existingOv,
      id: productId,
      name: input.name ? input.name.trim() : (existingOv.name || target?.name),
      slug: target?.slug,
      isAvailable: input.isAvailable !== undefined ? input.isAvailable : (existingOv.isAvailable ?? target?.isAvailable ?? true),
      images: input.photoUrl
        ? [{ url: input.photoUrl, alt: input.name || target?.name || '' }]
        : (existingOv.images || target?.images),
      variants: updatedVariants,
      price: minPrice,
      category: input.category || existingOv.category || target?.category || 'cakes',
      subcategory: input.subcategory || existingOv.subcategory || target?.subcategory,
      flavour: input.flavour || existingOv.flavour || target?.flavour,
      description: input.description || existingOv.description || target?.description,
      shortDescription: input.shortDescription || existingOv.shortDescription || target?.shortDescription,
      tags: input.tags || existingOv.tags || target?.tags,
      deliveryOptions: input.deliveryOptions || existingOv.deliveryOptions || target?.deliveryOptions,
      isFeatured: input.isFeatured !== undefined ? input.isFeatured : (existingOv.isFeatured ?? target?.isFeatured ?? false),
      isNewArrival: input.isNewArrival !== undefined ? input.isNewArrival : (existingOv.isNewArrival ?? target?.isNewArrival ?? false),
      isBestseller: input.isBestseller !== undefined ? input.isBestseller : (existingOv.isBestseller ?? target?.isBestseller ?? false),
      updatedAt: new Date().toISOString(),
    };

    overrides[productId] = updatedOverride;

    // 1. Save to JSON store on disk
    saveProductOverrides(overrides);

    // 2. Sync in-memory objects & realCakesData.ts
    syncMemoryAndRealCakes(productId, updatedOverride);

    // 3. Optional async sync to Supabase (non-blocking)
    if (isSupabaseConfigured()) {
      try {
        const pUpdates: any = {
          name: updatedOverride.name,
          is_available: updatedOverride.isAvailable,
          updated_at: updatedOverride.updatedAt,
        };
        if (updatedOverride.images && updatedOverride.images.length > 0) {
          pUpdates.images = updatedOverride.images;
        }

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Supabase sync timeout')), 2000)
        );

        await Promise.race([
          supabase.from('products').update(pUpdates).eq('id', productId),
          timeoutPromise,
        ]);
      } catch (sbErr: any) {
        console.warn(`[Supabase sync skipped/offline]: ${sbErr?.message || sbErr}`);
      }
    }

    return { success: true, data: formatToDbProduct(updatedOverride) };
  } catch (error: any) {
    console.error('[serverProductStore] saveProductUpdate error:', error);
    return { success: false, data: null, error: error.message };
  }
}

/**
 * Delete product permanently from store
 */
export async function deleteProductPermanent(productId: string): Promise<boolean> {
  try {
    const overrides = getProductOverrides();
    overrides[productId] = {
      ...(overrides[productId] || { id: productId }),
      isDeleted: true,
      updatedAt: new Date().toISOString(),
    };
    saveProductOverrides(overrides);

    // Remove from in-memory allProducts
    const idx = allProducts.findIndex((p) => p.id === productId);
    if (idx !== -1) allProducts.splice(idx, 1);

    // Remove from in-memory realCakeProducts & update file
    const realIdx = realCakeProducts.findIndex((p) => p.id === productId);
    if (realIdx !== -1) {
      realCakeProducts.splice(realIdx, 1);
      const realPath = getRealCakesFilePath();
      if (fs.existsSync(realPath)) {
        fs.writeFileSync(
          realPath,
          `import type { Product } from '@/types';\n\nexport const realCakeProducts: Product[] = ${JSON.stringify(realCakeProducts, null, 2)};\n`,
          'utf-8'
        );
      }
    }

    // Try Supabase delete non-blocking
    if (isSupabaseConfigured()) {
      Promise.resolve(supabase.from('products').delete().eq('id', productId)).catch(() => {});
    }

    return true;
  } catch (err) {
    console.error('[serverProductStore] deleteProductPermanent error:', err);
    return false;
  }
}
