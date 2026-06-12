// ============================================
// Database Seeding Script — Cake Connection
// Run with: node scripts/seed.js
// ============================================

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('YOUR_SUPABASE_URL')) {
  console.error('Error: Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your next-app/.env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const cakeProducts = [
  {
    id: 'cake-001',
    slug: 'chocolate-truffle-cake',
    name: 'Chocolate Truffle Cake',
    description: 'Indulge in layers of rich, dark chocolate sponge enveloped in a velvety Belgian chocolate ganache.',
    short_description: 'Rich Belgian chocolate ganache with dark chocolate layers',
    category: 'cakes',
    subcategory: 'chocolate',
    images: JSON.stringify([
      { url: '/images/hero-cake.png', alt: 'Chocolate Truffle Cake' },
      { url: '/images/black-forest-cake.png', alt: 'Chocolate Truffle Cake - Side View' },
    ]),
    flavour: 'chocolate',
    tags: ['bestseller', 'chocolate', 'birthday', 'anniversary'],
    delivery_options: ['2hr', '4hr', '6hr', 'same-day', 'next-day'],
    is_available: true,
    is_featured: true,
    is_new_arrival: false,
    is_bestseller: true,
    rating: 4.8,
    review_count: 324,
    variants: [
      { id: 'ct-500g', weight: '500g', price: 499, compare_at_price: 649, sku: 'CK-CT-500', stock: 50 },
      { id: 'ct-1kg', weight: '1kg', price: 899, compare_at_price: 1199, sku: 'CK-CT-1K', stock: 50 },
      { id: 'ct-1.5kg', weight: '1.5kg', price: 1259, compare_at_price: 1679, sku: 'CK-CT-1.5K', stock: 30 },
      { id: 'ct-2kg', weight: '2kg', price: 1619, compare_at_price: 2159, sku: 'CK-CT-2K', stock: 20 },
    ]
  },
  {
    id: 'cake-002',
    slug: 'red-velvet-dream',
    name: 'Red Velvet Dream',
    description: 'A show-stopping masterpiece with layers of moist red velvet sponge paired with luxurious cream cheese frosting.',
    short_description: 'Moist red velvet with cream cheese frosting',
    category: 'cakes',
    subcategory: 'red-velvet',
    images: JSON.stringify([
      { url: '/images/red-velvet-cake.png', alt: 'Red Velvet Dream Cake' },
      { url: '/images/hero-cake.png', alt: 'Red Velvet Dream - Side View' },
    ]),
    flavour: 'red-velvet',
    tags: ['new', 'premium', 'red-velvet', 'anniversary'],
    delivery_options: ['2hr', '4hr', '6hr', 'same-day', 'next-day'],
    is_available: true,
    is_featured: true,
    is_new_arrival: true,
    is_bestseller: false,
    rating: 4.9,
    review_count: 218,
    variants: [
      { id: 'rv-500g', weight: '500g', price: 549, compare_at_price: 769, sku: 'CK-RV-500', stock: 40 },
      { id: 'rv-1kg', weight: '1kg', price: 999, compare_at_price: 1399, sku: 'CK-RV-1K', stock: 40 },
      { id: 'rv-1.5kg', weight: '1.5kg', price: 1399, compare_at_price: 1959, sku: 'CK-RV-1.5K', stock: 25 },
      { id: 'rv-2kg', weight: '2kg', price: 1799, compare_at_price: 2519, sku: 'CK-RV-2K', stock: 15 },
    ]
  },
  {
    id: 'cake-003',
    slug: 'black-forest-classic',
    name: 'Black Forest Classic',
    description: 'A timeless German classic reimagined with premium ingredients. Layers of rich chocolate sponge soaked in cherry syrup.',
    short_description: 'Classic chocolate, cherry & cream layers',
    category: 'cakes',
    subcategory: 'black-forest',
    images: JSON.stringify([
      { url: '/images/black-forest-cake.png', alt: 'Black Forest Classic' },
      { url: '/images/hero-cake.png', alt: 'Black Forest Classic - Top View' },
    ]),
    flavour: 'black-forest',
    tags: ['bestseller', 'black-forest', 'classic', 'birthday'],
    delivery_options: ['2hr', '4hr', '6hr', 'same-day', 'next-day'],
    is_available: true,
    is_featured: true,
    is_new_arrival: false,
    is_bestseller: true,
    rating: 4.8,
    review_count: 412,
    variants: [
      { id: 'bf-500g', weight: '500g', price: 449, compare_at_price: 599, sku: 'CK-BF-500', stock: 60 },
      { id: 'bf-1kg', weight: '1kg', price: 799, compare_at_price: 1099, sku: 'CK-BF-1K', stock: 60 },
      { id: 'bf-1.5kg', weight: '1.5kg', price: 1119, compare_at_price: 1539, sku: 'CK-BF-1.5K', stock: 35 },
      { id: 'bf-2kg', weight: '2kg', price: 1439, compare_at_price: 1979, sku: 'CK-BF-2K', stock: 25 },
    ]
  }
];

const flowerProducts = [
  {
    id: 'flower-001',
    slug: 'royal-red-roses',
    name: 'Royal Red Roses',
    description: 'A stunning arrangement of 24 premium long-stem red roses, hand-tied with satin ribbon.',
    short_description: '24 premium long-stem red roses',
    category: 'flowers',
    subcategory: 'roses',
    images: JSON.stringify([
      { url: '/images/hero-flowers.png', alt: 'Royal Red Roses' },
      { url: '/images/luxury-bouquet.png', alt: 'Royal Red Roses - Detail' },
    ]),
    tags: ['roses', 'romantic', 'anniversary', 'popular'],
    delivery_options: ['2hr', '4hr', 'same-day', 'next-day'],
    is_available: true,
    is_featured: true,
    is_new_arrival: false,
    is_bestseller: true,
    rating: 4.8,
    review_count: 276,
    variants: [
      { id: 'rr-std', weight: '12 Stems', price: 799, compare_at_price: 999, sku: 'FL-RR-12', stock: 50 },
      { id: 'rr-prm', weight: '24 Stems', price: 1299, compare_at_price: 1599, sku: 'FL-RR-24', stock: 40 },
      { id: 'rr-lux', weight: '50 Stems', price: 2499, compare_at_price: 2999, sku: 'FL-RR-50', stock: 20 },
    ]
  }
];

const comboProducts = [
  {
    id: 'combo-001',
    slug: 'cake-and-flowers',
    name: 'Cake + Flowers Combo',
    description: 'The ultimate celebration duo — a rich 1kg handcrafted cake paired with a stunning bouquet of 12 fresh roses.',
    short_description: '1kg cake + 12 roses + greeting card',
    category: 'combos',
    subcategory: 'cake-flowers',
    images: JSON.stringify([
      { url: '/images/combo-gift.png', alt: 'Cake + Flowers Combo' },
      { url: '/images/hero-cake.png', alt: 'Cake + Flowers - Cake Detail' },
    ]),
    tags: ['combo', 'popular', 'birthday', 'anniversary', 'value'],
    delivery_options: ['4hr', '6hr', 'same-day', 'next-day'],
    is_available: true,
    is_featured: true,
    is_new_arrival: false,
    is_bestseller: true,
    rating: 4.9,
    review_count: 389,
    variants: [
      { id: 'cf-std', weight: 'Standard', price: 1499, compare_at_price: 2098, sku: 'CB-CF-STD', stock: 50 },
      { id: 'cf-prm', weight: 'Premium', price: 1999, compare_at_price: 2798, sku: 'CB-CF-PRM', stock: 35 },
    ]
  }
];

const allProducts = [...cakeProducts, ...flowerProducts, ...comboProducts];

async function seed() {
  console.log('Seeding Supabase database...');

  for (const productData of allProducts) {
    const { variants, ...product } = productData;
    
    // Insert product
    const { error: prodError } = await supabase
      .from('products')
      .upsert(product);

    if (prodError) {
      console.error(`Error inserting product ${product.name}:`, prodError.message);
      continue;
    }

    console.log(`✓ Product seeded: ${product.name}`);

    // Insert variants
    for (const variant of variants) {
      const { error: varError } = await supabase
        .from('product_variants')
        .upsert({
          ...variant,
          product_id: product.id
        });

      if (varError) {
        console.error(`Error inserting variant ${variant.sku}:`, varError.message);
      }
    }
  }

  console.log('Seeding completed successfully!');
}

seed();
