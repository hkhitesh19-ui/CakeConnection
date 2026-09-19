// ============================================
// Utility Functions — Cake Connection
// ============================================

/**
 * Format price in Indian Rupee format
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format discount percentage
 */
export function getDiscountPercent(price: number, compareAt: number): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

/**
 * Generate product slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Cloudinary image URL transformer
 */
export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
    crop?: string;
  } = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
  const {
    width,
    height,
    quality = 80,
    format = 'auto',
    crop = 'fill',
  } = options;

  const transforms: string[] = [`f_${format}`, `q_${quality}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(',')}/${publicId}`;
}

/**
 * WhatsApp direct link generator
 */
export function getWhatsAppLink(message: string, phone?: string): string {
  const number = phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Classname merge utility
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Format delivery time slot cleanly:
 * Strips category prefixes (e.g. "Morning Slot", "Standard Noon", "Afternoon Delight", etc.)
 * Ensures direct time range with "(No Fix Time)" at the end.
 * Example: "Morning Slot (10:00 AM - 1:00 PM)" -> "10:00 AM - 01:00 PM (No Fix Time)"
 */
export function formatTimeSlotDisplay(label: string): string {
  if (!label) return '';
  let clean = label.trim();

  // If label contains parentheses with time, e.g. "Morning Slot (10:00 AM - 1:00 PM)"
  const matchParen = clean.match(/\(([^)]+)\)/);
  if (matchParen && !matchParen[1].toLowerCase().includes('no fix time')) {
    clean = matchParen[1].trim();
  } else {
    // Strip common prefixes
    clean = clean
      .replace(/^(Morning Slot|Morning|Standard Noon|Standard|Afternoon Delight|Afternoon|Evening Celebration|Evening|Night Slot|Midnight Surprise)\s*[-:—]?\s*/i, '')
      .trim();
  }

  // Remove any existing "(No Fix Time)" or "No Fix Time" to avoid repetition
  clean = clean.replace(/\(?\s*no fix time\s*\)?/gi, '').trim();

  // Standardize spacing around dash
  clean = clean.replace(/\s*-\s*/g, ' - ');

  // Standardize single digit hours like 1:00 PM -> 01:00 PM
  clean = clean.replace(/\b(\d):([0-5]\d)\b/g, '0$1:$2');

  return `${clean} (No Fix Time)`;
}

/**
 * Official System & Surprise Delivery Instructions
 */
export const SYSTEM_DELIVERY_INSTRUCTIONS = [
  "After order placement, sender will get pickup-time product photo on WhatsApp.",
  "Once delivery is complete, WhatsApp update will be sent immediately.",
  "Due to weather or any external reason, delivery may get delayed — update for this will also be sent on WhatsApp.",
  "This is a Surprise Delivery, so sender's name is not shared with receiver until delivery is done.",
  "Once delivery person reaches the address with the product, sender's name is shared as per company rule.",
  "Please do not call for any query — we prefer WhatsApp message with Order Number and Delivery Date (+91 72038 24012)."
];

export const SYSTEM_DELIVERY_INSTRUCTIONS_TEXT = SYSTEM_DELIVERY_INSTRUCTIONS.map(
  (inst, idx) => `${idx + 1}. ${inst}`
).join('\n');
