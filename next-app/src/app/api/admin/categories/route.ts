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
    const { error } = await supabase.from('cake_categories').insert(body);
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Category created' });
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
    const { error } = await supabase.from('cake_categories').update(updateData).eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Category updated' });
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
    const { error } = await supabase.from('cake_categories').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
