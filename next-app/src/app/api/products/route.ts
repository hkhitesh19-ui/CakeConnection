import { NextResponse } from 'next/server';
import {
  getMergedProductsList,
  getMergedProductBySlug,
  getMergedProductById,
  getMergedProductsByCategory,
} from '@/lib/serverProductStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');

    // 1. Single product by ID
    if (id) {
      const product = getMergedProductById(id);
      return product
        ? NextResponse.json({ success: true, data: product })
        : NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // 2. Single product by Slug
    if (slug) {
      const product = getMergedProductBySlug(slug);
      return product
        ? NextResponse.json({ success: true, data: product })
        : NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // 3. Products by Category
    if (category) {
      const products = getMergedProductsByCategory(category);
      return NextResponse.json(
        { success: true, data: products },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      );
    }

    // 4. All Products
    const all = getMergedProductsList();
    return NextResponse.json(
      { success: true, data: all },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('[API /api/products] Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
