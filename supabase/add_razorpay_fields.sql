-- ============================================
-- SQL Migration: Add Razorpay & WhatsApp Fields to Orders
-- ============================================

-- Add Razorpay payment fields to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;

-- Add sender WhatsApp number column (with country code)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS sender_whatsapp TEXT;

-- Create index for Razorpay order ID lookups to optimize performance
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);
