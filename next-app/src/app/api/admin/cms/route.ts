import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: content, error } = await supabase
      .from('cms_content')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Supabase CMS fetch error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    console.error('Admin CMS API error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { section_name, content_json, is_active } = body;

    if (!section_name || !content_json) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Upsert CMS content by section_name
    const { data, error } = await supabase
      .from('cms_content')
      .upsert(
        { section_name, content_json, is_active, updated_at: new Date().toISOString() },
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
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
