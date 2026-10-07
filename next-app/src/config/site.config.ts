// ============================================
// Site Configuration — Cake Connection
// ============================================

export const siteConfig = {
  name: 'Cake Connection',
  tagline: 'Premium Cakes & Flower Bouquets',
  description: 'Order premium cakes, flower bouquets, and gift combos online in Vadodara. Same day delivery available.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cakeconnection.in',
  locale: 'en_IN',
  currency: 'INR',
  currencySymbol: '₹',

  // Location
  location: {
    city: 'Vadodara',
    state: 'Gujarat',
    country: 'India',
    pincode: '390007',
    coordinates: {
      lat: 22.3072,
      lng: 73.1812,
    },
  },

  // Contact
  contact: {
    phone: '+917203824012',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917203824012',
    email: 'Order.CakeConnection@gmail.com',
  },

  // Social Media
  social: {
    instagram: 'https://www.instagram.com/cakeconnection',
    facebook: 'https://www.facebook.com/cakeconnection',
    youtube: '',
    twitter: '',
  },

  // Business Hours
  hours: {
    open: '08:00',
    close: '22:00',
    days: 'Monday - Sunday',
  },
} as const;

// ============================================
// Navigation Configuration
// ============================================

export interface MegaMenuItem {
  label: string;
  href: string;
  description?: string;
}

export interface MegaMenuSection {
  title: string;
  items: MegaMenuItem[];
}

export interface NavCategory {
  label: string;
  href: string;
  megaMenu?: MegaMenuSection[];
  trendingLinks?: {
    title: string;
    items: MegaMenuItem[];
  };
  promotions?: {
    title: string;
    image: string;
    href: string;
  }[];
  featured?: {
    title: string;
    image: string;
    href: string;
  };
}

export const navigationConfig: NavCategory[] = [
  {
    label: 'Cakes',
    href: '/cakes',
    megaMenu: [
      {
        title: 'Cakes By Delivery speed',
        items: [
          { label: '1 to 2 Hours SuperFast Delivery', href: '/cakes?delivery=superfast' },
          { label: '2 to 4 hours Express Delivery', href: '/cakes?delivery=express' },
          { label: '4 to 6 Hours Same Day Delivery', href: '/cakes?delivery=sameday' },
        ],
      },
      {
        title: 'Cakes By Type',
        items: [
          { label: 'Mini Cakes (250g)', href: '/cakes?type=mini' },
          { label: 'Eggless Cakes', href: '/cakes?type=eggless' },
          { label: 'Photo Cakes', href: '/cakes?type=photo' },
          { label: 'Heart Shape Cakes', href: '/cakes?type=heart-shape' },
          { label: 'Designer Cakes', href: '/cakes?type=designer' },
          { label: 'Fondant Cakes', href: '/cakes?type=fondant' },
          { label: 'Dry Cakes', href: '/cakes?type=dry' },
          { label: 'CupCakes', href: '/cakes?type=cupcake' },
          { label: 'Pastry', href: '/cakes?type=pastry' },
          { label: 'Jar Cakes', href: '/cakes?type=jar-cake' },
        ],
      },
      {
        title: 'Cakes By Flavour',
        items: [
          { label: 'Chocolate Cakes', href: '/cakes?flavour=chocolate' },
          { label: 'Truffle Cakes', href: '/cakes?flavour=truffle' },
          { label: 'Black Forest Cakes', href: '/cakes?flavour=black-forest' },
          { label: 'Rasmalai Cakes', href: '/cakes?flavour=rasmalai' },
          { label: 'Butterscotch Cakes', href: '/cakes?flavour=butterscotch' },
          { label: 'Red Velvet Cakes', href: '/cakes?flavour=red-velvet' },
          { label: 'Vanilla Cakes', href: '/cakes?flavour=vanilla' },
          { label: 'Pineapple Cakes', href: '/cakes?flavour=pineapple' },
          { label: 'Fruit Cakes', href: '/cakes?flavour=fruit' },
          { label: 'Coffee Cakes', href: '/cakes?flavour=coffee' },
          { label: 'Kitkat Cakes', href: '/cakes?flavour=kitkat' },
        ],
      },
      {
        title: 'Design/Theme Based Cakes',
        items: [
          { label: 'Kids Cakes', href: '/cakes?theme=kids' },
          { label: 'Unicorn Cakes', href: '/cakes?theme=unicorn' },
          { label: 'Half Cakes', href: '/cakes?theme=half' },
          { label: 'Barbie Doll Cakes', href: '/cakes?theme=barbie' },
          { label: 'Tier Cakes', href: '/cakes?theme=tier' },
          { label: 'Cartoon Cakes', href: '/cakes?theme=cartoon' },
          { label: 'Spiderman Cakes', href: '/cakes?theme=spiderman' },
        ],
      },
      {
        title: 'Cake By Occasion',
        items: [
          { label: 'Birthday Cakes', href: '/cakes?occasion=birthday' },
          { label: 'Anniversary Cakes', href: '/cakes?occasion=anniversary' },
          { label: 'First Birthday Cakes', href: '/cakes?occasion=first-birthday' },
          { label: 'First Anniversary Cakes', href: '/cakes?occasion=first-anniversary' },
          { label: '25th Anniversary Cakes', href: '/cakes?occasion=25th-anniversary' },
        ],
      },
      {
        title: 'Cake Combos',
        items: [
          { label: 'Cake Combos', href: '/combos?type=cake-combos' },
          { label: 'Cakes And Flowers', href: '/combos?type=cake-flowers' },
          { label: 'Cakes And Chocolates', href: '/combos?type=cake-chocolates' },
          { label: 'Cakes And Teddies', href: '/combos?type=cake-teddies' },
        ],
      },
    ],
    trendingLinks: {
      title: 'Top Trending Links',
      items: [
        { label: 'Pinata Cakes', href: '/cakes?trending=pinata' },
        { label: 'Bento Cake', href: '/cakes?trending=bento' },
        { label: 'All Cakes', href: '/cakes' },
        { label: 'Best Seller Cakes', href: '/cakes?sort=best-seller' },
      ],
    },
    promotions: [
      {
        title: 'NEW ARRIVALS',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400&h=300',
        href: '/cakes?sort=new',
      },
      {
        title: 'PREMIUM CAKES',
        image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=400&h=300',
        href: '/cakes?type=premium',
      },
    ],
  },
  {
    label: 'Flower Bouquets',
    href: '/flowers',
    megaMenu: [
      {
        title: 'Flowers By Type',
        items: [
          { label: 'Roses', href: '/flowers?type=roses' },
          { label: 'Lilies', href: '/flowers?type=lilies' },
          { label: 'Orchids', href: '/flowers?type=orchids' },
          { label: 'Carnations', href: '/flowers?type=carnations' },
          { label: 'Gerberas', href: '/flowers?type=gerberas' },
          { label: 'Mixed Flowers', href: '/flowers?type=mixed' },
        ],
      },
      {
        title: 'Flowers By Occasion',
        items: [
          { label: 'Birthday Flowers', href: '/flowers?occasion=birthday' },
          { label: 'Anniversary Flowers', href: '/flowers?occasion=anniversary' },
          { label: 'Love & Romance', href: '/flowers?occasion=love' },
          { label: 'Congratulations', href: '/flowers?occasion=congratulations' },
          { label: 'Get Well Soon', href: '/flowers?occasion=get-well' },
        ],
      },
    ],
  },
  {
    label: 'Combos',
    href: '/combos',
    megaMenu: [
      {
        title: 'Gift Combos',
        items: [
          { label: 'Cake + Flowers', href: '/combos?type=cake-flowers' },
          { label: 'Cake + Teddy', href: '/combos?type=cake-teddy' },
          { label: 'Flower + Teddy', href: '/combos?type=flower-teddy' },
          { label: 'Premium Gift Hampers', href: '/combos?type=premium-hampers' },
        ],
      },
    ],
  },
];

// ============================================
// API Configuration
// ============================================

export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
} as const;

// ============================================
// Razorpay Configuration
// ============================================

export const razorpayConfig = {
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  currency: 'INR',
  name: 'Cake Connection',
  description: 'Premium Cakes & Flower Bouquets',
  theme: {
    color: '#B76E79',
  },
} as const;

// ============================================
// Cloudinary Configuration
// ============================================

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
  baseUrl: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo'}`,
} as const;

// ============================================
// WhatsApp Configuration
// ============================================

export const whatsappConfig = {
  number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917203824012',
  getOrderUrl: (productName?: string) => {
    const message = productName
      ? `Hi! I'd like to order: ${productName}`
      : `Hi! I'd like to place an order.`;
    return `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917203824012'}?text=${encodeURIComponent(message)}`;
  },
} as const;
