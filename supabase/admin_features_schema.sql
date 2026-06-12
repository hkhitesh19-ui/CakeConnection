-- ==========================================
-- PHASE 1: Security & Roles
-- ==========================================

-- User Roles Table (to manage admin access)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'manager', 'delivery')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- PHASE 2: Products & CMS
-- ==========================================

-- Product Variations
CREATE TABLE IF NOT EXISTS product_variations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL, -- references the existing product ID
  size TEXT,
  flavor TEXT,
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  sku TEXT UNIQUE
);

-- CMS Content (Banners, etc.)
CREATE TABLE IF NOT EXISTS cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT UNIQUE NOT NULL,
  content_json JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update existing orders table (Adding logistics columns)
-- Note: Assuming orders table exists.
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS delivery_boy_id UUID,
  ADD COLUMN IF NOT EXISTS tracking_link TEXT,
  ADD COLUMN IF NOT EXISTS refund_status TEXT DEFAULT 'none';


-- ==========================================
-- PHASE 3: CRM, Coupons, Analytics
-- ==========================================

-- Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  value DECIMAL(10,2) NOT NULL,
  min_spend DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Loyalty
CREATE TABLE IF NOT EXISTS customer_loyalty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email TEXT UNIQUE NOT NULL,
  points INTEGER DEFAULT 0,
  lifetime_value DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Abandoned Carts
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email TEXT NOT NULL,
  cart_data JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'recovered', 'lost')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
