-- Create Site Settings Table (stores config, banners, testimonials, slots, holidays, SEO)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow read access for everyone
CREATE POLICY "Enable read access for all users" 
ON site_settings 
FOR SELECT 
USING (true);

-- Allow all operations for admins (all authenticated/anonymous users for development convenience, can be restricted later)
CREATE POLICY "Enable all access for all users for development" 
ON site_settings 
FOR ALL 
USING (true);
