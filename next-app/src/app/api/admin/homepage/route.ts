import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/db';

// Default homepage section configs (mirrors siteStore defaults)
const DEFAULT_SECTIONS: Record<string, object> = {
  homepage_hero: {
    subtitle: 'PREMIUM ARTISAN GIFTS',
    title1: 'Luxury Cakes & Flowers',
    title2: 'Crafted For Emotions',
    description: 'Exquisite cakes and hand-arranged flower bouquets, delivered fresh across Vadodara. Make every moment unforgettable.',
    button1Text: 'Explore Cakes',
    button1Url: '/cakes',
    button2Text: 'Send Flowers',
    button2Url: '/flowers',
    image: '/images/hero-cake.png',
  },
  homepage_categories: [
    { name: 'Cakes', image: '/images/categories/cakes.png', link: '/cakes' },
    { name: 'Flowers', image: '/images/categories/flowers.png', link: '/flowers' },
    { name: 'Combos', image: '/images/categories/combos.png', link: '/combos' },
    { name: 'Plants', image: '/images/hero-flowers.png', link: '/plants' },
  ],
  homepage_occasions: [
    { name: 'Birthday', image: '/images/occasions/birthday.png', link: '/cakes?occasion=birthday' },
    { name: 'Anniversary', image: '/images/occasions/anniversary.png', link: '/cakes?occasion=anniversary' },
    { name: 'Love', image: '/images/occasions/love.png', link: '/cakes?occasion=valentine' },
    { name: "Congratulations", image: '/images/occasions/congratulations.png', link: '/cakes?occasion=wedding' },
  ],
  homepage_bestsellers: {
    title: 'Bestselling Cakes',
    subtitle: 'Our most-loved creations',
    count: 8,
  },
  homepage_delivery_banner: {
    title: 'Same Day Delivery Across Vadodara',
    subtitle: 'Order before 4 PM for guaranteed same-day delivery',
    buttonText: 'Order Now',
    buttonUrl: '/cakes',
  },
  homepage_bestseller_flowers: {
    title: 'Fresh Flower Bouquets',
    subtitle: 'Farm-fresh blooms arranged with love',
    count: 8,
  },
  homepage_combos: {
    title: 'Gift Combos',
    description: 'Curated cake & flower combos for every occasion',
  },
  homepage_trust_badges: [
    { icon: 'Shield', title: '100% Fresh', description: 'Baked & arranged fresh daily' },
    { icon: 'Truck', title: 'Same Day Delivery', description: 'Across Vadodara city' },
    { icon: 'Award', title: 'Premium Quality', description: 'Finest ingredients only' },
    { icon: 'HeadphonesIcon', title: '24/7 Support', description: 'WhatsApp & call support' },
  ],
  homepage_testimonials: [
    { name: 'Priya Sharma', rating: 5, text: 'Absolutely amazing cake! Delivered on time.', tag: 'Birthday Celebration' },
    { name: 'Rohan Mehta', rating: 5, text: 'Beautiful bouquet and delicious cake combo.', tag: 'Wedding Gift' },
    { name: 'Anjali Patel', rating: 5, text: 'Perfect surprise for my mom. She loved it!', tag: "Mother's Day Surprise" },
  ],
  homepage_instagram: [
    '/images/insta-1.jpg',
    '/images/insta-2.jpg',
    '/images/insta-3.jpg',
    '/images/insta-4.jpg',
    '/images/insta-5.jpg',
    '/images/insta-6.jpg',
  ],
  homepage_faq: [
    { question: 'What areas do you deliver to in Vadodara?', answer: 'We deliver across all major areas of Vadodara including Manjalpur, Alkapuri, Gotri, Vasna Road and many more.' },
    { question: 'How do I track my order?', answer: 'Track your order status in the "My Orders" section. We also send real-time updates via email/SMS.' },
    { question: 'Do you offer same-day and midnight delivery?', answer: 'Yes! Same-day delivery for orders before 6 PM. Midnight delivery (11:30 PM - 12:30 AM) available at nominal extra charge.' },
  ],
  homepage_footer_cta: {
    headline: 'Ready to Make Someone Smile?',
    subtitle: 'Order premium cakes & flowers for delivery across Vadodara',
    buttonText: 'Shop Now',
    buttonUrl: '/cakes',
  },
};

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, data: DEFAULT_SECTIONS });
    }

    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')
      .like('key', 'homepage_%');

    if (error) {
      console.error('Homepage settings fetch error:', error.message);
      return NextResponse.json({ success: true, data: DEFAULT_SECTIONS });
    }

    // Merge DB data over defaults
    const merged = { ...DEFAULT_SECTIONS };
    if (data) {
      data.forEach((row: { key: string; value: any }) => {
        merged[row.key] = row.value;
      });
    }

    return NextResponse.json({ success: true, data: merged });
  } catch (error: any) {
    console.error('Homepage API GET error:', error);
    return NextResponse.json({ success: true, data: DEFAULT_SECTIONS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { section, config } = body;

    if (!section || config === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: section, config' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      // Mock mode — just echo back success
      return NextResponse.json({ success: true, data: { key: section, value: config }, mock: true });
    }

    const { data, error } = await supabase
      .from('site_settings')
      .upsert(
        { key: section, value: config, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )
      .select()
      .single();

    if (error) {
      console.error('Homepage settings upsert error:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Homepage API POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
