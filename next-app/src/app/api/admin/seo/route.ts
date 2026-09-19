import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/db';

// Default SEO settings (mirrors siteStore defaults)
const DEFAULT_SEO = {
  routes: {
    '/': {
      title: 'Premium Cakes & Flower Bouquets in Vadodara | Same Day Delivery',
      description: 'Order premium cakes, flower bouquets, and gift combos online in Vadodara. Same day delivery available. Chocolate, Red Velvet, Black Forest & more.',
      keywords: 'cake delivery vadodara, flower bouquet vadodara, online cake order, birthday cake',
      ogImage: '',
      canonicalUrl: '',
    },
    '/cakes': {
      title: 'Premium Cakes Online | Birthday & Wedding Cakes | Vadodara',
      description: 'Order premium handcrafted cakes online in Vadodara — Chocolate Truffle, Red Velvet, Black Forest & more. Free delivery on orders above ₹999.',
      keywords: 'cakes, birthday cakes, chocolate cake, red velvet cake, order cake online, Vadodara, eggless cake, cake delivery',
      ogImage: '',
      canonicalUrl: '',
    },
    '/flowers': {
      title: 'Fresh Flower Bouquets Online | Rose, Lilies & Orchids | Vadodara',
      description: 'Order premium flower bouquets online in Vadodara — roses, lilies, orchids, mixed bouquets & birthday specials. Fresh farm-to-door delivery.',
      keywords: 'flower bouquets, roses, lilies, orchids, flower delivery Vadodara, birthday flowers, anniversary flowers, fresh flowers',
      ogImage: '',
      canonicalUrl: '',
    },
    '/combos': {
      title: 'Gift Combos Online | Cake, Flowers & Teddy Hampers | Vadodara',
      description: 'Order premium gift combos online in Vadodara — cake & flower combos, teddy combos, premium hampers & romantic sets.',
      keywords: 'gift combos, cake flowers combo, birthday combo, anniversary gift, premium hamper, Vadodara gifts',
      ogImage: '',
      canonicalUrl: '',
    },
    '/about': {
      title: 'About Cake Connection | Premium Bakery in Vadodara',
      description: 'Learn about Cake Connection — Vadodara\'s premium bakery offering handcrafted cakes and fresh flower bouquets since 2020.',
      keywords: 'about cake connection, vadodara bakery, premium cakes vadodara',
      ogImage: '',
      canonicalUrl: '',
    },
    '/faq': {
      title: 'FAQ | Cake Connection Vadodara',
      description: 'Frequently asked questions about ordering, delivery, and returns at Cake Connection Vadodara.',
      keywords: 'cake delivery faq, order cake online faq, vadodara cake delivery questions',
      ogImage: '',
      canonicalUrl: '',
    },
    '/cart': {
      title: 'Your Cart | Cake Connection',
      description: 'Review your cart and proceed to checkout at Cake Connection.',
      keywords: 'cake cart, checkout, order cake',
      ogImage: '',
      canonicalUrl: '',
    },
    'birthday-cake-vadodara': {
      title: 'Birthday Cake Delivery in Vadodara | Same Day | Cake Connection',
      description: 'Order birthday cakes online in Vadodara with same-day delivery. Chocolate, vanilla, red velvet & custom birthday cakes.',
      keywords: 'birthday cake vadodara, birthday cake delivery, order birthday cake online vadodara',
      ogImage: '',
      canonicalUrl: '',
    },
    'eggless-cake-vadodara': {
      title: 'Eggless Cake Delivery in Vadodara | Pure Veg Cakes | Cake Connection',
      description: 'Order eggless cakes online in Vadodara. 100% vegetarian, no egg cakes — chocolate, vanilla, fruit & more.',
      keywords: 'eggless cake vadodara, vegetarian cake, no egg cake delivery vadodara',
      ogImage: '',
      canonicalUrl: '',
    },
    'online-cake-delivery-vadodara': {
      title: 'Online Cake Delivery in Vadodara | Order Now | Cake Connection',
      description: 'Best online cake delivery in Vadodara. Order cakes for birthday, anniversary, wedding & more. Same day & midnight delivery.',
      keywords: 'online cake delivery vadodara, cake delivery vadodara, order cake online',
      ogImage: '',
      canonicalUrl: '',
    },
    'same-day-delivery-vadodara': {
      title: 'Same Day Cake & Flower Delivery Vadodara | Cake Connection',
      description: 'Get same-day cake and flower delivery in Vadodara. Order before 4 PM for guaranteed same-day delivery.',
      keywords: 'same day delivery vadodara, same day cake delivery, urgent cake delivery vadodara',
      ogImage: '',
      canonicalUrl: '',
    },
  },
};

const DEFAULT_AEO = {
  questions: [
    {
      id: 'aeo-1',
      question: 'What is the best cake shop in Vadodara?',
      answer: 'Cake Connection is a premium bakery in Vadodara known for handcrafted cakes and fresh flower bouquets with same-day delivery across 50+ pin codes.',
      sourcePage: '/',
    },
    {
      id: 'aeo-2',
      question: 'Can I get same-day cake delivery in Vadodara?',
      answer: 'Yes, Cake Connection offers same-day delivery for orders placed before 4 PM across all major areas of Vadodara including Manjalpur, Alkapuri, and Gotri.',
      sourcePage: '/cakes',
    },
  ],
};

const DEFAULT_GEO = {
  serviceRadiusKm: 25,
  citiesCovered: ['Vadodara', 'Manjalpur', 'Alkapuri', 'Gotri', 'Vasna', 'Akota', 'Fatehgunj'],
  googleBusinessUrl: '',
};

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        data: {
          seo: DEFAULT_SEO,
          aeo: DEFAULT_AEO,
          geo: DEFAULT_GEO,
        },
      });
    }

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .in('key', ['seo_settings', 'aeo_config', 'geo_config']);

    if (error) {
      console.error('SEO API fetch error:', error);
      return NextResponse.json({
        success: true,
        data: { seo: DEFAULT_SEO, aeo: DEFAULT_AEO, geo: DEFAULT_GEO },
      });
    }

    const settingsMap: Record<string, any> = {};
    (data || []).forEach((row: any) => {
      settingsMap[row.key] = row.value;
    });

    return NextResponse.json({
      success: true,
      data: {
        seo: settingsMap['seo_settings'] || DEFAULT_SEO,
        aeo: settingsMap['aeo_config'] || DEFAULT_AEO,
        geo: settingsMap['geo_config'] || DEFAULT_GEO,
      },
    });
  } catch (error: any) {
    console.error('SEO API error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({ success: false, error: 'Missing type or data' }, { status: 400 });
    }

    const keyMap: Record<string, string> = {
      seo: 'seo_settings',
      aeo: 'aeo_config',
      geo: 'geo_config',
    };

    const dbKey = keyMap[type];
    if (!dbKey) {
      return NextResponse.json({ success: false, error: 'Invalid type. Use seo, aeo, or geo.' }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        message: `Mock mode: ${type} settings saved locally.`,
        data,
      });
    }

    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: dbKey, value: data, updated_at: new Date().toISOString() });

    if (error) {
      console.error(`SEO API upsert error for ${dbKey}:`, error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `${type} settings saved successfully.` });
  } catch (error: any) {
    console.error('SEO API POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
