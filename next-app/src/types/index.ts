// ============================================
// Core Product Types — Cake Connection
// ============================================

export interface ProductImage {
  url: string;
  alt: string;
  publicId?: string; // Cloudinary public ID
}

export interface ProductVariant {
  id: string;
  weight: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  category: 'cakes' | 'flowers' | 'combos';
  subcategory: string;
  images: ProductImage[];
  variants: ProductVariant[];
  flavour?: string;
  tags: string[];
  deliveryOptions: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Cart Types
// ============================================

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  weight: string;
  flavour?: string;
  price: number;
  quantity: number;
  customMessage?: string;
  deliverySpeed?: string;
  deliveryDate?: string;
  deliverySlot?: string;
  slug?: string;
  category?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  couponCode?: string;
}

// ============================================
// User Types
// ============================================

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: Address[];
  createdAt: string;
}

// ============================================
// Order Types
// ============================================

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'razorpay' | 'cod' | 'upi';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: CartItem[];
  deliveryAddress: Address;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  couponCode?: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  specialInstructions?: string;
  deliveryDate: string;
  deliverySlot: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Wishlist Types
// ============================================

export interface WishlistItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  addedAt: string;
}

// ============================================
// Review Types
// ============================================

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  isVerified: boolean;
  createdAt: string;
}

// ============================================
// SEO Types
// ============================================

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  schemaType?: 'Product' | 'LocalBusiness' | 'BreadcrumbList' | 'WebPage';
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
