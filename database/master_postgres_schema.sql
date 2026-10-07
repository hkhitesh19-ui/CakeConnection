-- ==============================================================================
-- CakeConnection — Master Local PostgreSQL Database Schema
-- Self-Hosted on VPS (Lifetime 24/7 Active, Zero-Pause, 0.1ms Latency)
-- ==============================================================================

-- Enable UUID & Crypto extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Site Settings Table (Delivery slots, holidays, banners, config)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. Products Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  flavour TEXT,
  tags TEXT[],
  delivery_options TEXT[],
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 4.8,
  review_count INTEGER DEFAULT 12,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);

-- ------------------------------------------------------------------------------
-- 3. Product Images Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  public_id TEXT,
  display_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);

-- ------------------------------------------------------------------------------
-- 4. Product Variants Table (Weights, Prices, Stocks)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  weight TEXT NOT NULL,
  price NUMERIC NOT NULL,
  compare_at_price NUMERIC,
  sku TEXT,
  stock INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_price ON product_variants(price);

-- ------------------------------------------------------------------------------
-- 5. Cake Categories Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cake_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_name TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cake_categories_slug ON cake_categories(slug);

-- ------------------------------------------------------------------------------
-- 6. Orders Table (With Delivery Slots & Address)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_charge NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  coupon_code TEXT,
  order_status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  delivery_date DATE NOT NULL,
  delivery_slot TEXT NOT NULL,
  special_instructions TEXT,
  delivery_boy_id UUID,
  tracking_link TEXT,
  refund_status TEXT DEFAULT 'none',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ------------------------------------------------------------------------------
-- 7. Reviews Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);

-- ------------------------------------------------------------------------------
-- 8. Coupons Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  value DECIMAL(10,2) NOT NULL,
  min_spend DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- ------------------------------------------------------------------------------
-- 9. CMS Content Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT UNIQUE NOT NULL,
  content_json JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. User Roles Table (Admin Access)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'manager', 'delivery')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- Seed Default Categories
-- ------------------------------------------------------------------------------
INSERT INTO cake_categories (group_name, name, slug, display_order) VALUES
('Delivery based Cakes', '1 to 2 Hours SuperFast Delivery', '1-to-2-hours-superfast-delivery', 1),
('Delivery based Cakes', '2 to 4 hours Express Delivery', '2-to-4-hours-express-delivery', 2),
('Delivery based Cakes', '4 to 6 Hours Same Day Delivery', '4-to-6-hours-same-day-delivery', 3),

('Design Bases Cakes', 'Birthday cakes', 'birthday-cakes', 1),
('Design Bases Cakes', 'Anniversary Cakes', 'anniversary-cakes', 2),
('Design Bases Cakes', 'Kids Cartoon Theme Cakes', 'kids-cartoon-theme-cakes', 3),
('Design Bases Cakes', 'BabyShower Theme Cakes', 'babyshower-theme-cakes', 4),
('Design Bases Cakes', 'Welcome Baby cake', 'welcome-baby-cake', 5),
('Design Bases Cakes', 'Half cake/ 6 Month BirthDay cake', 'half-cake-6-month-birthday-cake', 6),
('Design Bases Cakes', 'Cake For Him', 'cake-for-him', 7),
('Design Bases Cakes', 'Cake for Her', 'cake-for-her', 8),
('Design Bases Cakes', 'Cake for Husband', 'cake-for-husband', 9),
('Design Bases Cakes', 'Cake for Wife', 'cake-for-wife', 10),
('Design Bases Cakes', 'Cake for Mother', 'cake-for-mother', 11),
('Design Bases Cakes', 'Cake for Father', 'cake-for-father', 12),
('Design Bases Cakes', 'Engagement/Wedding Cakes', 'engagement-wedding-cakes', 13),

('Flavours', 'Chocolate Cakes', 'chocolate-cakes', 1),
('Flavours', 'Pineapple Cakes', 'pineapple-cakes', 2),
('Flavours', 'Fresh Fruit Cakes', 'fresh-fruit-cakes', 3),
('Flavours', 'Red Velvet Cakes', 'red-velvet-cakes', 4),
('Flavours', 'Black Forest Cakes', 'black-forest-cakes', 5),
('Flavours', 'Butterscotch Cakes', 'butterscotch-cakes', 6),
('Flavours', 'Rasmalai Cakes', 'rasmalai-cakes', 7)
ON CONFLICT (slug) DO NOTHING;
