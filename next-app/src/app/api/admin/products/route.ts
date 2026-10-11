import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/db';
import {
  getMergedProductsList,
  formatToDbProduct,
  saveProductUpdate,
  deleteProductPermanent,
} from '@/lib/serverProductStore';

// ── GET: Fetch all products (or single by ?id= or ?slug=) ──────────────
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    // 1. Single Product by ID
    if (id) {
      if (isSupabaseConfigured()) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Supabase timeout')), 1500)
          );
          const queryPromise = supabase
            .from('products')
            .select('*, product_variants(*)')
            .eq('id', id)
            .single();

          const { data, error }: any = await Promise.race([queryPromise, timeoutPromise]);
          if (!error && data) {
            return NextResponse.json({ success: true, data });
          }
        } catch {
          // Fall through to persistent local store
        }
      }

      const merged = getMergedProductsList();
      const product = merged.find((p) => p.id === id);
      return product
        ? NextResponse.json({ success: true, data: formatToDbProduct(product) })
        : NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // 2. Single Product by Slug
    if (slug) {
      if (isSupabaseConfigured()) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Supabase timeout')), 1500)
          );
          const queryPromise = supabase
            .from('products')
            .select('*, product_variants(*)')
            .eq('slug', slug)
            .single();

          const { data, error }: any = await Promise.race([queryPromise, timeoutPromise]);
          if (!error && data) {
            return NextResponse.json({ success: true, data });
          }
        } catch {
          // Fall through to persistent local store
        }
      }

      const merged = getMergedProductsList();
      const product = merged.find((p) => p.slug === slug);
      return product
        ? NextResponse.json({ success: true, data: formatToDbProduct(product) })
        : NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // 3. All Products
    if (isSupabaseConfigured()) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Supabase timeout')), 2000)
        );
        const queryPromise = supabase
          .from('products')
          .select('*, product_variations:product_variants(*)')
          .order('created_at', { ascending: false });

        const { data, error }: any = await Promise.race([queryPromise, timeoutPromise]);
        if (!error && data && data.length > 0) {
          return NextResponse.json({ success: true, data });
        }
      } catch (sbErr) {
        // Supabase offline/timeout; fallback seamlessly to persistent local store
      }
    }

    const merged = getMergedProductsList();
    return NextResponse.json({
      success: true,
      data: merged.map(formatToDbProduct),
    });
  } catch (error: any) {
    console.error('Admin products GET error:', error);
    const merged = getMergedProductsList();
    return NextResponse.json({
      success: true,
      data: merged.map(formatToDbProduct),
    });
  }
}

// ── POST: Create a new product ──────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newId = body.id || `product-${Date.now()}`;

    const result = await saveProductUpdate({
      productId: newId,
      ...body,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error || 'Failed to create product' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Product created and saved permanently!',
    });
  } catch (error: any) {
    console.error('Admin products POST error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// ── PUT: Update an existing product ─────────────────────────
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, variants, ...productData } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    const result = await saveProductUpdate({
      productId: id,
      variants,
      ...productData,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error || 'Failed to update product' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Product updated and saved permanently!',
    });
  } catch (error: any) {
    console.error('Admin products PUT error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// ── DELETE: Delete a product by ID ──────────────────────────
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    const ok = await deleteProductPermanent(id);
    if (!ok) {
      return NextResponse.json({ success: false, message: 'Failed to delete product' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted permanently',
    });
  } catch (error: any) {
    console.error('Admin products DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
