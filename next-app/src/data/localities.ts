// ============================================
// Vadodara Localities Data
// Used for: locality pages, sitemap, delivery areas, schema
// ============================================

export interface Locality {
  slug: string;
  name: string;
  pincode: string;
  etaMinutes: number;       // ETA in minutes
  etaText: string;          // Human readable ETA e.g. "90 min"
  midnightAvailable: boolean;
  expresAvailable: boolean; // 1-2 hr superfast
  popularFor: string[];     // popular cake types in this area
}

export const LOCALITIES: Locality[] = [
  { slug: 'alkapuri',     name: 'Alkapuri',      pincode: '390007', etaMinutes: 90,  etaText: '90 min', midnightAvailable: true,  expresAvailable: true,  popularFor: ['Birthday Cakes', 'Designer Cakes', 'Flower Bouquets'] },
  { slug: 'gotri',        name: 'Gotri',         pincode: '390021', etaMinutes: 120, etaText: '2 hrs',  midnightAvailable: true,  expresAvailable: true,  popularFor: ['Eggless Cakes', 'Anniversary Cakes', 'Combos'] },
  { slug: 'manjalpur',    name: 'Manjalpur',     pincode: '390011', etaMinutes: 120, etaText: '2 hrs',  midnightAvailable: true,  expresAvailable: true,  popularFor: ['Photo Cakes', 'Birthday Cakes', 'Midnight Cakes'] },
  { slug: 'akota',        name: 'Akota',         pincode: '390020', etaMinutes: 120, etaText: '2 hrs',  midnightAvailable: true,  expresAvailable: false, popularFor: ['Chocolate Cakes', 'Red Velvet', 'Flower Bouquets'] },
  { slug: 'sayajigunj',   name: 'Sayajigunj',    pincode: '390005', etaMinutes: 120, etaText: '2 hrs',  midnightAvailable: true,  expresAvailable: false, popularFor: ['Fondant Cakes', 'Designer Cakes', 'Combos'] },
  { slug: 'vadiwadi',     name: 'Vadiwadi',      pincode: '390017', etaMinutes: 150, etaText: '2.5 hrs',midnightAvailable: false, expresAvailable: false, popularFor: ['Birthday Cakes', 'Eggless Cakes'] },
  { slug: 'fatehgunj',    name: 'Fatehgunj',     pincode: '390002', etaMinutes: 120, etaText: '2 hrs',  midnightAvailable: true,  expresAvailable: false, popularFor: ['Anniversary Cakes', 'Flower Bouquets'] },
  { slug: 'karelibaug',   name: 'Karelibaug',    pincode: '390018', etaMinutes: 180, etaText: '3 hrs',  midnightAvailable: false, expresAvailable: false, popularFor: ['Birthday Cakes', 'Combos'] },
  { slug: 'old-padra-road', name: 'Old Padra Road', pincode: '390015', etaMinutes: 150, etaText: '2.5 hrs', midnightAvailable: true, expresAvailable: false, popularFor: ['Photo Cakes', 'Designer Cakes'] },
  { slug: 'waghodia-road',  name: 'Waghodia Road',  pincode: '390019', etaMinutes: 180, etaText: '3 hrs',  midnightAvailable: false, expresAvailable: false, popularFor: ['Birthday Cakes', 'Eggless Cakes'] },
  { slug: 'subhanpura',   name: 'Subhanpura',    pincode: '390023', etaMinutes: 150, etaText: '2.5 hrs',midnightAvailable: false, expresAvailable: false, popularFor: ['Flower Bouquets', 'Combos'] },
  { slug: 'diwalipura',   name: 'Diwalipura',    pincode: '390015', etaMinutes: 150, etaText: '2.5 hrs',midnightAvailable: false, expresAvailable: false, popularFor: ['Birthday Cakes', 'Anniversary Cakes'] },
];

export function getLocality(slug: string): Locality | undefined {
  return LOCALITIES.find(l => l.slug === slug);
}

export const FREE_DELIVERY_ABOVE = 999; // Rs
export const MIDNIGHT_CHARGE = 149;     // Rs
export const SAME_DAY_CUTOFF = '6 PM';
export const MIDNIGHT_CUTOFF = '8 PM';
