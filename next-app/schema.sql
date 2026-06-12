-- Supabase Schema for Cake Connection Website

-- Enable UUID extension if not enabled
create extension if exists "uuid-ossp";

-- Create products table
create table if exists products (
  id text primary key,
  slug text unique not null,
  name text not null,
  description text not null,
  short_description text not null,
  category text not null check (category in ('cakes', 'flowers', 'combos')),
  subcategory text not null,
  images jsonb not null default '[]'::jsonb, -- Array of { url: string, alt: string }
  flavour text,
  tags text[] not null default '{}'::text[],
  delivery_options text[] not null default '{}'::text[],
  is_available boolean not null default true,
  is_featured boolean not null default false,
  is_new_arrival boolean not null default false,
  is_bestseller boolean not null default false,
  rating numeric(3, 2) not null default 0.00,
  review_count integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create product variants table
create table if exists product_variants (
  id text primary key,
  product_id text references products(id) on delete cascade not null,
  weight text not null,
  price numeric(10, 2) not null,
  compare_at_price numeric(10, 2),
  sku text not null,
  stock integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reviews table
create table if exists reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id text references products(id) on delete cascade not null,
  user_id text,
  user_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  images text[] default '{}'::text[],
  is_verified boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create orders table
create table if exists orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  user_id text,
  delivery_address jsonb not null,
  subtotal numeric(10, 2) not null,
  delivery_charge numeric(10, 2) not null default 0.00,
  discount numeric(10, 2) not null default 0.00,
  total numeric(10, 2) not null,
  coupon_code text,
  order_status text not null default 'pending' check (order_status in ('pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled', 'refunded')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  payment_method text not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  special_instructions text,
  delivery_date date not null,
  delivery_slot text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create order items table (to structure details properly)
create table if exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id text references products(id) on delete restrict not null,
  variant_id text not null,
  name text not null,
  image text not null,
  weight text not null,
  flavour text,
  price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  custom_message text,
  delivery_speed text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) policies for security (optional or read-only public)
alter table products enable row level security;
alter table product_variants enable row level security;
alter table reviews enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Create Policies for public read access
create policy "Allow public read access to products" on products for select using (true);
create policy "Allow public read access to variants" on product_variants for select using (true);
create policy "Allow public read access to reviews" on reviews for select using (true);

-- Authenticated/public insert policies
create policy "Allow public to insert reviews" on reviews for insert with check (true);
create policy "Allow public to insert orders" on orders for insert with check (true);
create policy "Allow public to insert order items" on order_items for insert with check (true);
