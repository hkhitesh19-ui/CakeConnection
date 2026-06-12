-- 1. Create Cake Categories Table
CREATE TABLE IF NOT EXISTS cake_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_name TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set RLS (Row Level Security) - open for read, open for admin
ALTER TABLE cake_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON cake_categories FOR SELECT USING (true);
CREATE POLICY "Enable all access for admin users" ON cake_categories FOR ALL USING (true);

-- 2. Insert Default Categories
INSERT INTO cake_categories (group_name, name, slug, display_order) VALUES
-- Delivery based Cakes
('Delivery based Cakes', '1 to 2 Hours SuperFast Delivery', '1-to-2-hours-superfast-delivery', 1),
('Delivery based Cakes', '2 to 4 hours Express Delivery', '2-to-4-hours-express-delivery', 2),
('Delivery based Cakes', '4 to 6 Hours Same Day Delivery', '4-to-6-hours-same-day-delivery', 3),
('Delivery based Cakes', 'MidNight Delivery', 'midnight-delivery', 4),

-- Design Bases Cakes
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

-- Festival or Special Occassion Based
('Festival or Special Occassion Based', 'Happy Valentines Day', 'happy-valentines-day', 1),
('Festival or Special Occassion Based', 'Happy Women''s Day Cakes', 'happy-womens-day-cakes', 2),
('Festival or Special Occassion Based', 'Mother''s Day Cakes', 'mothers-day-cakes', 3),
('Festival or Special Occassion Based', 'Father''s Day Cakes', 'fathers-day-cakes', 4),
('Festival or Special Occassion Based', 'Happy Rakshabandhan', 'happy-rakshabandhan', 5),
('Festival or Special Occassion Based', 'Happy Teacher''s Day', 'happy-teachers-day', 6),
('Festival or Special Occassion Based', 'Happy FriendShip Day', 'happy-friendship-day', 7),
('Festival or Special Occassion Based', 'Christmas Cakes', 'christmas-cakes', 8),
('Festival or Special Occassion Based', 'Happy New Year Cake', 'happy-new-year-cake', 9);
