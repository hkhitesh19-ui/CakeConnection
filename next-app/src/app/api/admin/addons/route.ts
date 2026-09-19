import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/db';
import { DEFAULT_ADDON_ITEMS, AddonProduct } from '@/data/addons';

const SETTING_KEY = 'addon_items_catalog';

// Helper to fetch current catalog from Supabase or fallback
async function getCatalog(): Promise<AddonProduct[]> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_ADDON_ITEMS;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', SETTING_KEY)
      .single();

    if (error || !data || !Array.isArray(data.value) || data.value.length === 0) {
      // Auto-seed default 30 items if not yet present
      await supabase.from('site_settings').upsert(
        {
          key: SETTING_KEY,
          value: DEFAULT_ADDON_ITEMS,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );
      return DEFAULT_ADDON_ITEMS;
    }

    return data.value as AddonProduct[];
  } catch (err) {
    console.error('Error in getCatalog:', err);
    return DEFAULT_ADDON_ITEMS;
  }
}

// Helper to save catalog to Supabase
async function saveCatalog(items: AddonProduct[]): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;

  try {
    const { error } = await supabase.from('site_settings').upsert(
      {
        key: SETTING_KEY,
        value: items,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    );
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error saving addon catalog:', err);
    return false;
  }
}

// GET — Retrieve all addon products
export async function GET() {
  try {
    const items = await getCatalog();
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    console.error('Addons API GET error:', error);
    return NextResponse.json({ success: true, data: DEFAULT_ADDON_ITEMS });
  }
}

// POST — Add a new addon product or Reset / Bulk update
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Reset to default 30 items
    if (body.action === 'reset') {
      const ok = await saveCatalog(DEFAULT_ADDON_ITEMS);
      if (!ok) {
        return NextResponse.json({ success: false, error: 'Failed to reset catalog' }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        message: 'Addon catalog reset to default 30 items',
        data: DEFAULT_ADDON_ITEMS,
      });
    }

    // 2. Bulk save full catalog
    if (body.action === 'bulk_save' && Array.isArray(body.items)) {
      const ok = await saveCatalog(body.items);
      if (!ok) {
        return NextResponse.json({ success: false, error: 'Failed to save items' }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: 'Addon catalog saved successfully', data: body.items });
    }

    // 3. Add single new item
    const newItem: AddonProduct = {
      id: body.id || `addon-${Date.now()}`,
      name: body.name || 'New Add-on',
      category: body.category || 'flowers',
      price: Number(body.price) || 99,
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : undefined,
      image: body.image || 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=400&h=400',
      description: body.description || '',
      inStock: body.inStock !== false,
      displayOrder: Number(body.displayOrder) || 99,
    };

    const currentCatalog = await getCatalog();
    const updated = [newItem, ...currentCatalog];
    const ok = await saveCatalog(updated);

    if (!ok) {
      return NextResponse.json({ success: false, error: 'Failed to insert addon item' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Add-on created successfully', data: newItem });
  } catch (error: any) {
    console.error('Addons API POST error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal error' }, { status: 500 });
  }
}

// PUT — Update an existing addon product
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });
    }

    const currentCatalog = await getCatalog();
    const index = currentCatalog.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Add-on item not found' }, { status: 404 });
    }

    // Merge updates
    currentCatalog[index] = {
      ...currentCatalog[index],
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : currentCatalog[index].price,
      compareAtPrice: updates.compareAtPrice !== undefined ? (updates.compareAtPrice ? Number(updates.compareAtPrice) : undefined) : currentCatalog[index].compareAtPrice,
    };

    const ok = await saveCatalog(currentCatalog);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Failed to update addon item' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Add-on updated successfully', data: currentCatalog[index] });
  } catch (error: any) {
    console.error('Addons API PUT error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal error' }, { status: 500 });
  }
}

// DELETE — Remove an addon product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });
    }

    const currentCatalog = await getCatalog();
    const updated = currentCatalog.filter((item) => item.id !== id);

    const ok = await saveCatalog(updated);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Failed to delete addon item' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Add-on deleted successfully' });
  } catch (error: any) {
    console.error('Addons API DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal error' }, { status: 500 });
  }
}
