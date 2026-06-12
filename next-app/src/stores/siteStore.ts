import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

// ---- Interfaces ----

export interface GeneralSettings {
  storeName: string;
  tagline: string;
  supportEmail: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: { lat: number; lng: number };
  hours: { open: string; close: string; days: string };
  socials: { instagram: string; facebook: string };
}

export interface HeroConfig {
  subtitle: string;
  title1: string;
  title2: string;
  description: string;
  button1Text: string;
  button1Url: string;
  button2Text: string;
  button2Url: string;
  image: string;
  images: string[];
}

export interface DeliveryBannerConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
}

export interface Testimonial {
  name: string;
  rating: number;
  text: string;
  tag: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface DeliverySlot {
  label: string;
  isFestivalOnly?: boolean;
}

export interface DeliverySpeedOption {
  label: string;
  value: string;
  surcharge: number;
  icon: string; // lucide icon name
  description: string;
}

export interface PincodeCharge {
  pincode: string;
  charge: number;
}

export interface FestivalDate {
  date: string; // YYYY-MM-DD
  name: string;
  slots: string[];
}

export interface ClosedDate {
  date: string; // YYYY-MM-DD
  reason: string;
}

export interface SEORouteConfig {
  title: string;
  description: string;
  keywords: string;
}

export interface SEOSettings {
  routes: Record<string, SEORouteConfig>;
}

interface SiteState {
  generalSettings: GeneralSettings;
  heroConfig: HeroConfig;
  deliveryBanner: DeliveryBannerConfig;
  testimonials: Testimonial[];
  faqs: FAQItem[];
  deliverySlots: DeliverySlot[];
  deliverySpeeds: DeliverySpeedOption[];
  pincodeCharges: PincodeCharge[];
  festivalDates: FestivalDate[];
  closedDates: ClosedDate[];
  seoSettings: SEOSettings;
  coupons: any[];
  loading: boolean;
  
  // Actions
  fetchSettings: () => Promise<void>;
  updateSetting: (key: string, value: any) => Promise<boolean>;
}

// ---- Default Values ----

const DEFAULT_SETTINGS: GeneralSettings = {
  storeName: 'Cake Connection',
  tagline: 'Premium Cakes & Flower Bouquets',
  supportEmail: 'hello@cakeconnection.in',
  phone: '+919876543210',
  whatsapp: '919876543210',
  address: 'Exit Gate, GF9 RutuPlatina Complex, Eva Mall Rd, Manjalpur',
  city: 'Vadodara',
  state: 'Gujarat',
  pincode: '390011',
  coordinates: { lat: 22.27, lng: 73.1855 },
  hours: { open: '08:00', close: '22:00', days: 'Monday - Sunday' },
  socials: {
    instagram: 'https://www.instagram.com/cakeconnection',
    facebook: 'https://www.facebook.com/cakeconnection',
  },
};

const DEFAULT_HERO: HeroConfig = {
  subtitle: 'PREMIUM ARTISAN GIFTS',
  title1: 'Luxury Cakes & Flowers',
  title2: 'Crafted For Emotions',
  description: 'Exquisite cakes and hand-arranged flower bouquets, delivered fresh across Vadodara. Make every moment unforgettable.',
  button1Text: 'Explore Cakes',
  button1Url: '/cakes',
  button2Text: 'Send Flowers',
  button2Url: '/flowers',
  image: '/images/hero-cake.png',
  images: [
    '/images/hero-cake.png',
    '/images/hero-flowers.png',
    '/images/luxury-bouquet.png',
    '/images/birthday-bouquet.png'
  ],
};

const DEFAULT_DELIVERY_BANNER: DeliveryBannerConfig = {
  title: 'Same Day Delivery Across Vadodara',
  subtitle: 'Order before 4 PM for guaranteed same-day delivery',
  buttonText: 'Order Now',
  buttonUrl: '/cakes',
};

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    name: 'Priya Sharma',
    rating: 5,
    text: 'I ordered a red velvet cake for my daughter\'s birthday at the last minute, and Cake Connection delivered it within 3 hours! The cake was absolutely stunning — moist, rich, and beautifully decorated. My daughter\'s face lit up the moment she saw it. Thank you for making her day so special!',
    tag: 'Birthday Celebration',
  },
  {
    name: 'Rohan Mehta',
    rating: 5,
    text: 'Sent a luxury bouquet and cake hamper as a wedding gift to my best friend in Vadodara. She sent me photos — the arrangement was gorgeous! The packaging was elegant and the cake was fresh despite the delivery distance. Cake Connection is now my go-to for every celebration.',
    tag: 'Wedding Gift',
  },
  {
    name: 'Anjali Patel',
    rating: 5,
    text: 'I live in Mumbai but wanted to send something special to my mom in Vadodara for Mother\'s Day. The strawberry cake and lily bouquet arrived perfectly. My mom called me crying happy tears. The quality, freshness, and care in the presentation — everything was beyond expectations. Will order again!',
    tag: 'Mother\'s Day Surprise',
  },
];

const DEFAULT_FAQS: FAQItem[] = [
  {
    question: 'What areas do you deliver to in Vadodara?',
    answer: 'We deliver across all major areas of Vadodara including Manjalpur, Alkapuri, Gotri, Vasna Road, Akota, Fatehgunj, Karelibaug, Subhanpura, Waghodia Road, Sama, and many more. We cover over 50+ pin codes across the city. If you\'re unsure whether we deliver to your area, simply enter your pin code at checkout or reach out to us on WhatsApp — we\'ll confirm instantly.',
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order is placed, you can track its status in the "My Orders" section of your account. We also send real-time updates via email/SMS. You can contact us directly on WhatsApp with your Order Number for instant delivery status.',
  },
  {
    question: 'Do you offer same-day and midnight cake delivery?',
    answer: 'Yes! We offer same-day delivery for orders placed before 6 PM. Our midnight delivery (11:30 PM - 12:30 AM) is also highly popular for surprises, available at a nominal additional charge. We recommend booking midnight orders 6 hours in advance.',
  },
];

const DEFAULT_SLOTS: DeliverySlot[] = [
  { label: 'Morning Slot (09:00 AM - 12:00 PM)' },
  { label: 'Standard Noon (12:00 PM - 03:00 PM)' },
  { label: 'Afternoon Delight (03:00 PM - 06:00 PM)' },
  { label: 'Evening Celebration (06:00 PM - 09:00 PM)' },
  { label: 'Midnight Surprise (11:30 PM - 12:15 AM)' },
];

const DEFAULT_DELIVERY_SPEEDS: DeliverySpeedOption[] = [
  { label: '2 Hours Express', value: '2hr', surcharge: 149, icon: 'Zap', description: 'Lightning-fast delivery' },
  { label: '4 Hours Delivery', value: '4hr', surcharge: 99, icon: 'Clock', description: 'Quick & reliable' },
  { label: '6 Hours Delivery', value: '6hr', surcharge: 49, icon: 'Timer', description: 'Same day, no rush' },
  { label: 'Same Day', value: 'same-day', surcharge: 29, icon: 'Truck', description: 'Order by noon' },
  { label: 'Next Day', value: 'next-day', surcharge: 0, icon: 'Calendar', description: 'Free delivery' },
];

const DEFAULT_SEO: SEOSettings = {
  routes: {
    '/': {
      title: 'Premium Cakes & Flower Bouquets in Vadodara | Same Day Delivery',
      description: 'Order premium cakes, flower bouquets, and gift combos online in Vadodara. Same day delivery available. Chocolate, Red Velvet, Black Forest & more.',
      keywords: 'cake delivery vadodara, flower bouquet vadodara, online cake order, birthday cake',
    },
    '/cakes': {
      title: 'Premium Cakes Online | Birthday & Wedding Cakes | Vadodara',
      description: 'Order premium handcrafted cakes online in Vadodara — Chocolate Truffle, Red Velvet, Black Forest & more. Free delivery on orders above ₹999.',
      keywords: 'cakes, birthday cakes, chocolate cake, red velvet cake, order cake online, Vadodara, eggless cake, cake delivery',
    },
    '/flowers': {
      title: 'Fresh Flower Bouquets Online | Rose, Lilies & Orchids | Vadodara',
      description: 'Order premium flower bouquets online in Vadodara — roses, lilies, orchids, mixed bouquets & birthday specials. Fresh farm-to-door delivery.',
      keywords: 'flower bouquets, roses, lilies, orchids, flower delivery Vadodara, birthday flowers, anniversary flowers, fresh flowers',
    },
    '/combos': {
      title: 'Gift Combos Online | Cake, Flowers & Teddy Hampers | Vadodara',
      description: 'Order premium gift combos online in Vadodara — cake & flower combos, teddy combos, premium hampers & romantic sets. Perfect for birthdays & anniversaries.',
      keywords: 'gift combos, cake flowers combo, birthday combo, anniversary gift, premium hamper, Vadodara gifts, cake teddy combo',
    },
  },
};

// ---- Store Implementation ----

export const useSiteStore = create<SiteState>((set, get) => ({
  generalSettings: DEFAULT_SETTINGS,
  heroConfig: DEFAULT_HERO,
  deliveryBanner: DEFAULT_DELIVERY_BANNER,
  testimonials: DEFAULT_TESTIMONIALS,
  faqs: DEFAULT_FAQS,
  deliverySlots: DEFAULT_SLOTS,
  deliverySpeeds: DEFAULT_DELIVERY_SPEEDS,
  pincodeCharges: [],
  festivalDates: [],
  closedDates: [],
  seoSettings: DEFAULT_SEO,
  coupons: [],
  loading: true,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.from('site_settings').select('*');
      
      if (error) {
        console.warn('Could not fetch site_settings (it might not be created yet):', error.message);
        set({ loading: false });
        return;
      }

      if (data && data.length > 0) {
        const settingsMap: Partial<SiteState> = {};
        
        data.forEach((row) => {
          const key = row.key;
          const value = row.value;
          
          if (key === 'general_settings') settingsMap.generalSettings = { ...DEFAULT_SETTINGS, ...value };
          else if (key === 'hero_section') settingsMap.heroConfig = { ...DEFAULT_HERO, ...value };
          else if (key === 'delivery_banner') settingsMap.deliveryBanner = { ...DEFAULT_DELIVERY_BANNER, ...value };
          else if (key === 'testimonials') settingsMap.testimonials = value;
          else if (key === 'faqs') settingsMap.faqs = value;
          else if (key === 'delivery_slots') settingsMap.deliverySlots = value;
          else if (key === 'delivery_speeds') settingsMap.deliverySpeeds = value;
          else if (key === 'pincode_charges') settingsMap.pincodeCharges = value;
          else if (key === 'festival_dates') settingsMap.festivalDates = value;
          else if (key === 'closed_dates') settingsMap.closedDates = value;
          else if (key === 'seo_settings') settingsMap.seoSettings = { ...DEFAULT_SEO, routes: { ...DEFAULT_SEO.routes, ...value.routes } };
          else if (key === 'coupons') settingsMap.coupons = value;
        });

        set(settingsMap);
      }
    } catch (err) {
      console.error('Error in fetchSettings:', err);
    }
    set({ loading: false });
  },

  updateSetting: async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() });
        
      if (error) {
        console.error(`Error saving settings for key ${key}:`, error.message);
        return false;
      }
      
      // Update local state
      const stateUpdate: any = {};
      if (key === 'general_settings') stateUpdate.generalSettings = value;
      else if (key === 'hero_section') stateUpdate.heroConfig = value;
      else if (key === 'delivery_banner') stateUpdate.deliveryBanner = value;
      else if (key === 'testimonials') stateUpdate.testimonials = value;
      else if (key === 'faqs') stateUpdate.faqs = value;
      else if (key === 'delivery_slots') stateUpdate.deliverySlots = value;
      else if (key === 'delivery_speeds') stateUpdate.deliverySpeeds = value;
      else if (key === 'pincode_charges') stateUpdate.pincodeCharges = value;
      else if (key === 'festival_dates') stateUpdate.festivalDates = value;
      else if (key === 'closed_dates') stateUpdate.closedDates = value;
      else if (key === 'seo_settings') stateUpdate.seoSettings = value;
      else if (key === 'coupons') stateUpdate.coupons = value;
      
      set(stateUpdate);
      return true;
    } catch (err) {
      console.error('Error in updateSetting:', err);
      return false;
    }
  },
}));
