import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { data: content, error } = await supabase
      .from('cms_content')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Supabase CMS fetch error:', error);
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({ success: true, data: content || [] });
  } catch (error: any) {
    console.error('Admin CMS API error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { section_name, content_json, is_active } = body;

    if (!section_name || content_json === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('cms_content')
      .upsert(
        { section_name, content_json, is_active: is_active ?? true, updated_at: new Date().toISOString() },
        { onConflict: 'section_name' }
      )
      .select()
      .single();

    if (error) {
      console.error('Supabase CMS upsert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Admin CMS POST error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
