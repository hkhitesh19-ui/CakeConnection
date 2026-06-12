// ============================================
// Dynamic Pricing Engine — Cake Connection
// ============================================

export interface WeightOption {
  label: string;
  value: string;
  multiplier: number;
}

export interface DeliverySpeedOption {
  label: string;
  value: string;
  surcharge: number;
  icon: string; // lucide icon name
  description: string;
}

export interface FlavourOption {
  label: string;
  value: string;
  surcharge: number;
  isPremium: boolean;
}

// ── Weight Options ──────────────────────────
export const WEIGHT_OPTIONS: WeightOption[] = [
  { label: '500g', value: '500g', multiplier: 0.55 },
  { label: '1 kg', value: '1kg', multiplier: 1.0 },
  { label: '1.5 kg', value: '1.5kg', multiplier: 1.4 },
  { label: '2 kg', value: '2kg', multiplier: 1.8 },
];

// ── Delivery Speed Options ──────────────────
export const DELIVERY_SPEED_OPTIONS: DeliverySpeedOption[] = [
  {
    label: '2 Hours Express',
    value: '2hr',
    surcharge: 149,
    icon: 'Zap',
    description: 'Lightning-fast delivery',
  },
  {
    label: '4 Hours Delivery',
    value: '4hr',
    surcharge: 99,
    icon: 'Clock',
    description: 'Quick & reliable',
  },
  {
    label: '6 Hours Delivery',
    value: '6hr',
    surcharge: 49,
    icon: 'Timer',
    description: 'Same day, no rush',
  },
  {
    label: 'Same Day',
    value: 'same-day',
    surcharge: 29,
    icon: 'Truck',
    description: 'Order by noon',
  },
  {
    label: 'Next Day',
    value: 'next-day',
    surcharge: 0,
    icon: 'Calendar',
    description: 'Free delivery',
  },
];

// ── Flavour Options ─────────────────────────
export const FLAVOUR_OPTIONS: FlavourOption[] = [
  { label: 'Chocolate', value: 'chocolate', surcharge: 0, isPremium: false },
  { label: 'Black Forest', value: 'black-forest', surcharge: 0, isPremium: false },
  { label: 'Vanilla', value: 'vanilla', surcharge: 0, isPremium: false },
  { label: 'Pineapple', value: 'pineapple', surcharge: 0, isPremium: false },
  { label: 'Red Velvet', value: 'red-velvet', surcharge: 100, isPremium: true },
  { label: 'Butterscotch', value: 'butterscotch', surcharge: 50, isPremium: true },
  { label: 'Strawberry', value: 'strawberry', surcharge: 50, isPremium: true },
];

// ── Time Slots ──────────────────────────────
export const TIME_SLOTS = [
  '08:00 AM – 10:00 AM',
  '10:00 AM – 12:00 PM',
  '12:00 PM – 02:00 PM',
  '02:00 PM – 04:00 PM',
  '04:00 PM – 06:00 PM',
  '06:00 PM – 08:00 PM',
  '08:00 PM – 10:00 PM',
];

// ── Price Calculator ────────────────────────

export interface PriceBreakdown {
  basePrice: number;
  weightPrice: number;
  deliverySurcharge: number;
  flavourSurcharge: number;
  totalPrice: number;
  savings: number;
  weight: string;
  deliverySpeed: string;
  flavour: string;
}

/**
 * Calculate dynamic price based on selections.
 * @param basePrice     - The base price of the cake at 1kg weight
 * @param weight        - Selected weight value (e.g., '500g', '1kg')
 * @param deliverySpeed - Selected delivery speed value (e.g., '2hr', 'same-day')
 * @param flavour       - Selected flavour value (e.g., 'chocolate', 'red-velvet')
 * @param compareAtPrice - Optional original/compare price at 1kg for discount calc
 */
export function calculatePrice(
  basePrice: number,
  weight: string = '1kg',
  deliverySpeed: string = 'same-day',
  flavour: string = 'chocolate',
  compareAtPrice?: number
): PriceBreakdown {
  const weightOption = WEIGHT_OPTIONS.find((w) => w.value === weight);
  const deliveryOption = DELIVERY_SPEED_OPTIONS.find((d) => d.value === deliverySpeed);
  const flavourOption = FLAVOUR_OPTIONS.find((f) => f.value === flavour);

  const multiplier = weightOption?.multiplier ?? 1;
  const deliverySurcharge = deliveryOption?.surcharge ?? 0;
  const flavourSurcharge = flavourOption?.surcharge ?? 0;

  const weightPrice = Math.round(basePrice * multiplier);
  const totalPrice = weightPrice + deliverySurcharge + flavourSurcharge;

  const originalTotal = compareAtPrice
    ? Math.round(compareAtPrice * multiplier) + deliverySurcharge + flavourSurcharge
    : totalPrice;
  const savings = Math.max(0, originalTotal - totalPrice);

  return {
    basePrice,
    weightPrice,
    deliverySurcharge,
    flavourSurcharge,
    totalPrice,
    savings,
    weight,
    deliverySpeed,
    flavour,
  };
}

/**
 * Get the minimum price for a product (500g, next-day, base flavour).
 */
export function getStartingPrice(basePrice: number): number {
  return Math.round(basePrice * 0.55);
}

/**
 * Format delivery ETA based on speed.
 */
export function getDeliveryETA(speed: string): string {
  switch (speed) {
    case '2hr':
      return 'Within 2 hours';
    case '4hr':
      return 'Within 4 hours';
    case '6hr':
      return 'Within 6 hours';
    case 'same-day':
      return 'Today before 10 PM';
    case 'next-day':
      return 'Tomorrow';
    default:
      return 'Standard delivery';
  }
}
