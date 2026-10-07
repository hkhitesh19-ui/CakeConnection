import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/db';
import { allProducts } from '@/data/products';

// Helper to map all fallback products to DB-like shape
function getFallbackProducts() {
  return allProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    short_description: p.shortDescription,
    category: p.category,
    subcategory: p.subcategory,
    images: p.images,
    flavour: p.flavour,
    tags: p.tags,
    delivery_options: p.deliveryOptions,
    is_available: p.isAvailable,
    is_featured: p.isFeatured,
    is_new_arrival: p.isNewArrival,
    is_bestseller: p.isBestseller,
    rating: p.rating,
    review_count: p.reviewCount,
    price: p.variants[0]?.price ?? 0,
    in_stock: p.isAvailable,
    product_variations: p.variants.map((v) => ({
      id: v.id,
      weight: v.weight,
      price: v.price,
      compare_at_price: v.compareAtPrice,
      sku: v.sku,
      stock: v.stock,
    })),
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  }));
}

// ── GET: Fetch all products (or single by ?id=) ──────────────
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!isSupabaseConfigured()) {
      if (id) {
        const product = allProducts.find((p) => p.id === id);
        return product
          ? NextResponse.json({ success: true, data: product })
          : NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
      }
      if (slug) {
        const product = allProducts.find((p) => p.slug === slug);
        return product
          ? NextResponse.json({ success: true, data: product })
          : NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: getFallbackProducts() });
    }

    if (id) {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .eq('id', id)
        .single();

      if (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 404 });
      }
      return NextResponse.json({ success: true, data });
    }

    if (slug) {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .eq('slug', slug)
        .single();

      if (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 404 });
      }
      return NextResponse.json({ success: true, data });
    }

    const { data: products, error } = await supabase
      .from('products')
      .select('*, product_variations:product_variants(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase products fetch error, falling back to local dataset:', error);
      return NextResponse.json({ success: true, data: getFallbackProducts() });
    }

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    console.warn('Admin products GET error, falling back to local dataset:', error);
    return NextResponse.json({ success: true, data: getFallbackProducts() });
  }
}

// ── POST: Create a new product ──────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isSupabaseConfigured()) {
      const mockId = `product-${Date.now()}`;
      return NextResponse.json({
        success: true,
        data: { id: mockId, ...body },
        message: 'Product created successfully (mock)',
      });
    }

    const { variants, ...productData } = body;

    // Insert product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        short_description: productData.shortDescription,
        category: productData.category,
        subcategory: productData.subcategory,
        images: productData.images || [],
        flavour: productData.flavour,
        tags: productData.tags || [],
        delivery_options: productData.deliveryOptions || [],
        is_available: productData.isAvailable ?? true,
        is_featured: productData.isFeatured ?? false,
        is_new_arrival: productData.isNewArrival ?? false,
        is_bestseller: productData.isBestseller ?? false,
      })
      .select()
      .single();

    if (productError) {
      console.error('Product insert error:', productError);
      return NextResponse.json({ success: false, message: productError.message }, { status: 500 });
    }

    // Insert variants
    if (variants && variants.length > 0) {
      const variantRows = variants.map((v: any) => ({
        product_id: product.id,
        weight: v.weight,
        price: v.price,
        compare_at_price: v.compareAtPrice || null,
        sku: v.sku,
        stock: v.stock ?? 0,
      }));

      const { error: variantError } = await supabase
        .from('product_variants')
        .insert(variantRows);

      if (variantError) {
        console.error('Variant insert error:', variantError);
      }
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully',
    });
  } catch (error: any) {
    console.error('Admin products POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
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

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        data: { id, ...productData, variants },
        message: 'Product updated successfully (mock)',
      });
    }

    // Update product
    const { data: product, error: productError } = await supabase
      .from('products')
      .update({
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        short_description: productData.shortDescription,
        category: productData.category,
        subcategory: productData.subcategory,
        images: productData.images || [],
        flavour: productData.flavour,
        tags: productData.tags || [],
        delivery_options: productData.deliveryOptions || [],
        is_available: productData.isAvailable ?? true,
        is_featured: productData.isFeatured ?? false,
        is_new_arrival: productData.isNewArrival ?? false,
        is_bestseller: productData.isBestseller ?? false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (productError) {
      console.error('Product update error:', productError);
      return NextResponse.json({ success: false, message: productError.message }, { status: 500 });
    }

    // Replace variants: delete old, insert new
    if (variants) {
      await supabase.from('product_variants').delete().eq('product_id', id);

      if (variants.length > 0) {
        const variantRows = variants.map((v: any) => ({
          product_id: id,
          weight: v.weight,
          price: v.price,
          compare_at_price: v.compareAtPrice || null,
          sku: v.sku,
          stock: v.stock ?? 0,
        }));

        const { error: variantError } = await supabase
          .from('product_variants')
          .insert(variantRows);

        if (variantError) {
          console.error('Variant update error:', variantError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product updated successfully',
    });
  } catch (error: any) {
    console.error('Admin products PUT error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
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

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        message: 'Product deleted successfully (mock)',
      });
    }

    // Delete variants first (cascade)
    await supabase.from('product_variants').delete().eq('product_id', id);

    // Delete product
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('Product delete error:', error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Admin products DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
