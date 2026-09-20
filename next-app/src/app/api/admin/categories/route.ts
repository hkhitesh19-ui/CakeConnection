import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/db';

const MOCK_CATEGORIES = [
  { id: '1', group_name: 'By Occasion', name: 'Birthday Cakes', slug: 'birthday-cakes', display_order: 1 },
  { id: '2', group_name: 'By Occasion', name: 'Anniversary Cakes', slug: 'anniversary-cakes', display_order: 2 },
  { id: '3', group_name: 'By Design', name: 'Photo Cakes', slug: 'photo-cakes', display_order: 1 },
  { id: '4', group_name: 'By Design', name: 'Tier Cakes', slug: 'tier-cakes', display_order: 2 },
  { id: '5', group_name: 'By Flavour', name: 'Chocolate Cakes', slug: 'chocolate-cakes', display_order: 1 },
  { id: '6', group_name: 'By Flavour', name: 'Butterscotch Cakes', slug: 'butterscotch-cakes', display_order: 2 }
];

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, data: MOCK_CATEGORIES });
  }

  try {
    const { data, error } = await supabase
      .from('cake_categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, message: 'Category created (mock)' });
  }

  try {
    const body = await request.json();
    const { id, ...insertData } = body;
    // Strip empty string ID so database generates a valid UUID
    const payload = (id && typeof id === 'string' && id.trim() !== '') ? body : insertData;

    if (!payload.name || !payload.slug) {
      return NextResponse.json({ success: false, error: 'Category name and slug are required' }, { status: 400 });
    }

    const { data, error } = await supabase.from('cake_categories').insert(payload).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Category created', data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, message: 'Category updated (mock)' });
  }

  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID is required for update' }, { status: 400 });
    }
    const { data, error } = await supabase.from('cake_categories').update(updateData).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Category updated', data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, message: 'Category deleted (mock)' });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID is required for deletion' }, { status: 400 });
    }
    const { error } = await supabase.from('cake_categories').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, message: 'Categories reordered (mock)' });
  }

  try {
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Items array is required' }, { status: 400 });
    }

    const updatePromises = items.map((item: { id: string; display_order: number; group_name?: string }) => {
      const payload: any = { display_order: item.display_order };
      if (item.group_name) {
        payload.group_name = item.group_name;
      }
      return supabase
        .from('cake_categories')
        .update(payload)
        .eq('id', item.id);
    });

    const results = await Promise.all(updatePromises);
    const hasError = results.find((r) => r.error);
    if (hasError && hasError.error) {
      throw hasError.error;
    }

    return NextResponse.json({ success: true, message: 'Categories reordered successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
