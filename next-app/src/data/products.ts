// ============================================
// Mock Product Catalog — Cake Connection
// ============================================

import type { Product } from '@/types';
import { realCakeProducts } from './realCakesData';
import { scrapedFlowerProducts } from './scrapedFlowersData';

// ── Cakes ───────────────────────────────────

export const cakeProducts: Product[] = realCakeProducts;

// ── Flower Bouquets ─────────────────────────

export const flowerProducts: Product[] = [
  {
    id: 'flower-001',
    slug: 'royal-red-roses',
    name: 'Royal Red Roses',
    description:
      'A stunning arrangement of 24 premium long-stem red roses, hand-tied with satin ribbon and presented in luxury wrapping. Fresh from the farm, these vibrant roses symbolize deep love and passion. Perfect for anniversaries, proposals, and romantic gestures.',
    shortDescription: '24 premium long-stem red roses',
    category: 'flowers',
    subcategory: 'roses',
    images: [
      { url: '/images/hero-flowers.png', alt: 'Royal Red Roses' },
      { url: '/images/luxury-bouquet.png', alt: 'Royal Red Roses - Detail' },
    ],
    variants: [
      { id: 'rr-std', weight: '12 Stems', price: 799, compareAtPrice: 999, sku: 'FL-RR-12', stock: 100000 },
      { id: 'rr-prm', weight: '24 Stems', price: 1299, compareAtPrice: 1599, sku: 'FL-RR-24', stock: 100000 },
      { id: 'rr-lux', weight: '50 Stems', price: 2499, compareAtPrice: 2999, sku: 'FL-RR-50', stock: 100000 },
    ],
    tags: ['roses', 'romantic', 'anniversary', 'popular'],
    deliveryOptions: ['2hr', '4hr', 'same-day', 'next-day'],
    isAvailable: true,
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
    rating: 4.8,
    reviewCount: 276,
    createdAt: '2024-01-01',
    updatedAt: '2024-12-01',
  },
  {
    id: 'flower-002',
    slug: 'luxury-mixed-bouquet',
    name: 'Luxury Mixed Bouquet',
    description:
      'An exquisite arrangement of premium roses, lilies, orchids, and seasonal fillers — artfully hand-arranged by our master florists. Each bouquet is unique, reflecting the finest blooms of the season. Presented in a luxury hat box.',
    shortDescription: 'Premium roses, lilies & orchids arrangement',
    category: 'flowers',
    subcategory: 'mixed',
    images: [
      { url: '/images/luxury-bouquet.png', alt: 'Luxury Mixed Bouquet' },
      { url: '/images/hero-flowers.png', alt: 'Luxury Mixed - Detail' },
    ],
    variants: [
      { id: 'lm-std', weight: 'Standard', price: 1199, compareAtPrice: 1499, sku: 'FL-LM-STD', stock: 100000 },
      { id: 'lm-prm', weight: 'Premium', price: 1599, compareAtPrice: 1999, sku: 'FL-LM-PRM', stock: 100000 },
      { id: 'lm-lux', weight: 'Grand Luxury', price: 2299, compareAtPrice: 2799, sku: 'FL-LM-LUX', stock: 100000 },
    ],
    tags: ['luxury', 'mixed', 'premium', 'anniversary'],
    deliveryOptions: ['4hr', '6hr', 'same-day', 'next-day'],
    isAvailable: true,
    isFeatured: true,
    isNewArrival: false,
    isBestseller: false,
    rating: 4.9,
    reviewCount: 189,
    createdAt: '2024-02-01',
    updatedAt: '2024-12-01',
  },
  {
    id: 'flower-003',
    slug: 'birthday-sunshine',
    name: 'Birthday Sunshine',
    description:
      'Brighten someone\'s special day with this cheerful arrangement of sunflowers, gerberas, and yellow roses. Wrapped in kraft paper with a rustic ribbon bow. A burst of sunshine that brings instant smiles.',
    shortDescription: 'Sunflowers, gerberas & yellow roses',
    category: 'flowers',
    subcategory: 'birthday',
    images: [
      { url: '/images/birthday-bouquet.png', alt: 'Birthday Sunshine' },
      { url: '/images/hero-flowers.png', alt: 'Birthday Sunshine - Side View' },
    ],
    variants: [
      { id: 'bs-std', weight: 'Standard', price: 699, compareAtPrice: 899, sku: 'FL-BS-STD', stock: 100000 },
      { id: 'bs-prm', weight: 'Premium', price: 999, compareAtPrice: 1299, sku: 'FL-BS-PRM', stock: 100000 },
    ],
    tags: ['birthday', 'cheerful', 'sunflowers', 'popular'],
    deliveryOptions: ['2hr', '4hr', '6hr', 'same-day', 'next-day'],
    isAvailable: true,
    isFeatured: false,
    isNewArrival: false,
    isBestseller: true,
    rating: 4.7,
    reviewCount: 347,
    createdAt: '2024-01-01',
    updatedAt: '2024-12-01',
  },
  {
    id: 'flower-004',
    slug: 'elegant-white-lilies',
    name: 'Elegant White Lilies',
    description:
      'A graceful arrangement of pristine white Oriental lilies, accented with eucalyptus and baby\'s breath. Symbolizing purity and elegance, this bouquet is perfect for sympathy, weddings, and sophisticated occasions.',
    shortDescription: 'Pristine white Oriental lilies',
    category: 'flowers',
    subcategory: 'lilies',
    images: [
      { url: '/images/luxury-bouquet.png', alt: 'Elegant White Lilies' },
      { url: '/images/birthday-bouquet.png', alt: 'Elegant White Lilies - Detail' },
    ],
    variants: [
      { id: 'wl-std', weight: '6 Stems', price: 899, compareAtPrice: 1099, sku: 'FL-WL-6', stock: 100000 },
      { id: 'wl-prm', weight: '12 Stems', price: 1599, compareAtPrice: 1899, sku: 'FL-WL-12', stock: 100000 },
    ],
    tags: ['lilies', 'elegant', 'wedding', 'sympathy'],
    deliveryOptions: ['4hr', '6hr', 'same-day', 'next-day'],
    isAvailable: true,
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
    rating: 4.8,
    reviewCount: 98,
    createdAt: '2024-09-01',
    updatedAt: '2024-12-01',
  },
  {
    id: 'flower-005',
    slug: 'pink-carnation-charm',
    name: 'Pink Carnation Charm',
    description:
      'A delicate bouquet of soft pink carnations mixed with baby pink roses and greenery. Wrapped in blush tissue with a velvet ribbon. An affordable yet elegant choice that speaks volumes of affection.',
    shortDescription: 'Pink carnations with baby roses',
    category: 'flowers',
    subcategory: 'carnations',
    images: [
      { url: '/images/birthday-bouquet.png', alt: 'Pink Carnation Charm' },
      { url: '/images/hero-flowers.png', alt: 'Pink Carnation Charm - Side' },
    ],
    variants: [
      { id: 'pc-std', weight: 'Standard', price: 599, compareAtPrice: 799, sku: 'FL-PC-STD', stock: 100000 },
      { id: 'pc-prm', weight: 'Premium', price: 899, compareAtPrice: 1099, sku: 'FL-PC-PRM', stock: 100000 },
    ],
    tags: ['carnations', 'pink', 'affordable', 'mothers-day'],
    deliveryOptions: ['2hr', '4hr', '6hr', 'same-day', 'next-day'],
    isAvailable: true,
    isFeatured: false,
    isNewArrival: false,
    isBestseller: false,
    rating: 4.6,
    reviewCount: 203,
    createdAt: '2024-03-01',
    updatedAt: '2024-12-01',
  },
  {
    id: 'flower-006',
    slug: 'orchid-elegance',
    name: 'Orchid Elegance',
    description:
      'Premium Phalaenopsis orchids arranged in an elegant glass vase. These long-lasting exotic blooms add a touch of luxury to any space. Each plant blooms for weeks, making it a truly lasting gift.',
    shortDescription: 'Premium Phalaenopsis orchids in glass vase',
    category: 'flowers',
    subcategory: 'orchids',
    images: [
      { url: '/images/luxury-bouquet.png', alt: 'Orchid Elegance' },
      { url: '/images/hero-flowers.png', alt: 'Orchid Elegance - Detail' },
    ],
    variants: [
      { id: 'oe-single', weight: 'Single Stem', price: 1299, compareAtPrice: 1599, sku: 'FL-OE-1', stock: 100000 },
      { id: 'oe-double', weight: 'Double Stem', price: 1999, compareAtPrice: 2499, sku: 'FL-OE-2', stock: 100000 },
    ],
    tags: ['orchid', 'premium', 'long-lasting', 'luxury'],
    deliveryOptions: ['same-day', 'next-day'],
    isAvailable: true,
    isFeatured: true,
    isNewArrival: false,
    isBestseller: false,
    rating: 4.9,
    reviewCount: 64,
    createdAt: '2024-05-01',
    updatedAt: '2024-12-01',
  },
  ...scrapedFlowerProducts,
];

// ── Combos ──────────────────────────────────

export const comboProducts: Product[] = [
  {
    id: 'combo-001',
    slug: 'cake-and-flowers',
    name: 'Cake + Flowers Combo',
    description:
      'The ultimate celebration duo — a rich 1kg handcrafted cake of your choice paired with a stunning bouquet of 12 fresh roses. Includes a premium greeting card and gift wrapping. Perfect for birthdays, anniversaries, and every moment worth celebrating.',
    shortDescription: '1kg cake + 12 roses + greeting card',
    category: 'combos',
    subcategory: 'cake-flowers',
    images: [
      { url: '/images/combo-gift.png', alt: 'Cake + Flowers Combo' },
      { url: '/images/hero-cake.png', alt: 'Cake + Flowers - Cake Detail' },
      { url: '/images/hero-flowers.png', alt: 'Cake + Flowers - Flowers Detail' },
    ],
    variants: [
      { id: 'cf-std', weight: 'Standard', price: 1499, compareAtPrice: 2098, sku: 'CB-CF-STD', stock: 100000 },
      { id: 'cf-prm', weight: 'Premium', price: 1999, compareAtPrice: 2798, sku: 'CB-CF-PRM', stock: 100000 },
      { id: 'cf-lux', weight: 'Luxury', price: 2799, compareAtPrice: 3998, sku: 'CB-CF-LUX', stock: 100000 },
    ],
    tags: ['combo', 'popular', 'birthday', 'anniversary', 'value'],
    deliveryOptions: ['4hr', '6hr', 'same-day', 'next-day'],
    isAvailable: true,
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 389,
    createdAt: '2024-01-01',
    updatedAt: '2024-12-01',
  },
  {
    id: 'combo-002',
    slug: 'cake-and-teddy',
    name: 'Cake + Teddy Combo',
    description:
      'Sweeten the surprise with a delicious 1kg designer cake and an adorable premium plush teddy bear (12 inch). Includes gift wrapping and a personalized message card. A heartwarming combo that brings smiles and warm hugs.',
    shortDescription: '1kg cake + 12" teddy bear + gift wrap',
    category: 'combos',
    subcategory: 'cake-teddy',
    images: [
      { url: '/images/hero-cake.png', alt: 'Cake + Teddy Combo' },
      { url: '/images/combo-gift.png', alt: 'Cake + Teddy - Detail' },
    ],
    variants: [
      { id: 'ct-std', weight: 'Standard', price: 1299, compareAtPrice: 1798, sku: 'CB-CT-STD', stock: 100000 },
      { id: 'ct-prm', weight: 'Premium', price: 1699, compareAtPrice: 2298, sku: 'CB-CT-PRM', stock: 100000 },
    ],
    tags: ['combo', 'teddy', 'birthday', 'kids', 'value'],
    deliveryOptions: ['4hr', '6hr', 'same-day', 'next-day'],
    isAvailable: true,
    isFeatured: false,
    isNewArrival: false,
    isBestseller: false,
    rating: 4.7,
    reviewCount: 156,
    createdAt: '2024-02-01',
    updatedAt: '2024-12-01',
  },
  {
    id: 'combo-003',
    slug: 'premium-gift-hamper',
    name: 'Premium Gift Hamper',
    description:
      'Go all out with our luxury gift hamper featuring a premium cake, fresh flower bouquet, artisan chocolates, scented candle, and gourmet treats — all elegantly packaged in a handcrafted keepsake wooden box. The ultimate luxury gifting experience.',
    shortDescription: 'Cake + flowers + chocolates + luxury box',
    category: 'combos',
    subcategory: 'premium-hampers',
    images: [
      { url: '/images/luxury-bouquet.png', alt: 'Premium Gift Hamper' },
      { url: '/images/combo-gift.png', alt: 'Premium Hamper - Contents' },
    ],
    variants: [
      { id: 'ph-std', weight: 'Classic', price: 2499, compareAtPrice: 3499, sku: 'CB-PH-STD', stock: 100000 },
      { id: 'ph-prm', weight: 'Grand', price: 3499, compareAtPrice: 4999, sku: 'CB-PH-PRM', stock: 100000 },
      { id: 'ph-lux', weight: 'Royal', price: 4999, compareAtPrice: 6999, sku: 'CB-PH-LUX', stock: 100000 },
    ],
    tags: ['premium', 'hamper', 'luxury', 'anniversary', 'corporate'],
    deliveryOptions: ['same-day', 'next-day'],
    isAvailable: true,
    isFeatured: true,
    isNewArrival: false,
    isBestseller: false,
    rating: 4.9,
    reviewCount: 78,
    createdAt: '2024-04-01',
    updatedAt: '2024-12-01',
  },
  {
    id: 'combo-004',
    slug: 'romantic-date-night',
    name: 'Romantic Date Night',
    description:
      'Set the mood for a perfect evening — includes a 1kg chocolate cake, 24 red roses, a box of premium Belgian chocolates, and a bottle of sparkling grape juice. Everything you need for a magical night.',
    shortDescription: 'Cake + 24 roses + chocolates + sparkling juice',
    category: 'combos',
    subcategory: 'romantic',
    images: [
      { url: '/images/combo-gift.png', alt: 'Romantic Date Night' },
      { url: '/images/hero-flowers.png', alt: 'Romantic Date Night - Flowers' },
    ],
    variants: [
      { id: 'rd-std', weight: 'Standard', price: 2199, compareAtPrice: 2999, sku: 'CB-RD-STD', stock: 100000 },
      { id: 'rd-prm', weight: 'Premium', price: 2999, compareAtPrice: 3999, sku: 'CB-RD-PRM', stock: 100000 },
    ],
    tags: ['romantic', 'date-night', 'anniversary', 'valentines'],
    deliveryOptions: ['4hr', '6hr', 'same-day', 'next-day'],
    isAvailable: true,
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
    rating: 4.8,
    reviewCount: 92,
    createdAt: '2024-07-01',
    updatedAt: '2024-12-01',
  },
];

// ── All Products ────────────────────────────

export const allProducts: Product[] = [...cakeProducts, ...flowerProducts, ...comboProducts];

// Clean WordPress thumbnail URL suffix to load original high-res images
allProducts.forEach((p) => {
  p.images.forEach((img) => {
    if (img.url) {
      img.url = img.url.replace(/-\d+x\d+(\.(jpg|jpeg|png|webp|gif))$/i, '$1');
    }
  });
});


// ── Helpers ─────────────────────────────────

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return allProducts.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return allProducts.filter((p) => p.isFeatured);
}

export function getRelatedProducts(productId: string, limit: number = 4): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  return allProducts
    .filter((p) => p.id !== productId && p.category === product.category)
    .slice(0, limit);
}

// ── Mock Reviews ────────────────────────────

export interface MockReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  occasion: string;
  date: string;
  isVerified: boolean;
}

export const mockReviews: MockReview[] = [
  { id: 'r1', userName: 'Priya S.', rating: 5, comment: 'Absolutely stunning cake! The chocolate truffle was rich and the delivery was right on time. My daughter loved it!', occasion: 'Birthday', date: '2024-11-15', isVerified: true },
  { id: 'r2', userName: 'Rahul M.', rating: 5, comment: 'Surprised my wife with the cake + flowers combo. She was moved to tears. Premium quality all around.', occasion: 'Anniversary', date: '2024-11-10', isVerified: true },
  { id: 'r3', userName: 'Ananya P.', rating: 4, comment: 'Beautiful bouquet and the cake tasted amazing. Only reason for 4 stars is the delivery was 20 minutes late. Otherwise perfect!', occasion: 'Birthday', date: '2024-10-28', isVerified: true },
  { id: 'r4', userName: 'Vikram S.', rating: 5, comment: 'Ordered 5 cakes for our office event. Every single one was delivered fresh and on time. The black forest was a hit!', occasion: 'Corporate Event', date: '2024-10-15', isVerified: true },
  { id: 'r5', userName: 'Neha J.', rating: 5, comment: 'The red velvet cake was hands down the best I have ever had. Moist, rich, and the cream cheese frosting was perfect.', occasion: "Mother's Day", date: '2024-10-01', isVerified: true },
  { id: 'r6', userName: 'Amit K.', rating: 5, comment: 'Midnight delivery worked flawlessly. The cake arrived at exactly 12:00 AM. Made the birthday surprise absolutely perfect!', occasion: 'Birthday', date: '2024-09-20', isVerified: true },
];
