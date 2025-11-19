-- Run All Migrations
-- This file combines all migrations for easy execution
-- Run this in Supabase SQL Editor if you want to set up everything at once

-- ============================================
-- Migration 001: Create Announcements Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_announcements_date ON public.announcements(date DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_category ON public.announcements(category);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read announcements" ON public.announcements;
CREATE POLICY "Anyone can read announcements"
  ON public.announcements
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage announcements" ON public.announcements;
CREATE POLICY "Authenticated users can manage announcements"
  ON public.announcements
  FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- Migration 002: Create Gallery Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_gallery_date ON public.gallery(date DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery(category);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read gallery" ON public.gallery;
CREATE POLICY "Anyone can read gallery"
  ON public.gallery
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage gallery" ON public.gallery;
CREATE POLICY "Authenticated users can manage gallery"
  ON public.gallery
  FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- Create Helper Functions
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic updated_at
DROP TRIGGER IF EXISTS update_announcements_updated_at ON public.announcements;
CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_gallery_updated_at ON public.gallery;
CREATE TRIGGER update_gallery_updated_at
  BEFORE UPDATE ON public.gallery
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Sample Data (Optional - Remove if not needed)
-- ============================================

-- Sample Announcements
INSERT INTO public.announcements (title, description, category, date) VALUES
('Community Clean-up Drive', 'Join us for our monthly community clean-up drive. Meet at the barangay hall at 7:00 AM.', 'Event', 'March 15, 2024'),
('Free Medical Check-up', 'Free medical check-up for senior citizens and PWDs. Bring your barangay ID.', 'Health', 'March 20, 2024'),
('Road Closure Notice', 'Main street will be closed for maintenance from March 12-14. Please use alternate routes.', 'Notice', 'March 10, 2024')
ON CONFLICT DO NOTHING;

-- Sample Gallery Items
INSERT INTO public.gallery (title, image, date, category) VALUES
('Community Event', '/sk-logo.png', 'January 2024', 'Events'),
('Youth Leadership Training', '/sk-logo.png', 'January 2024', 'Education'),
('Community Garden Initiative', '/sk-logo.png', 'December 2023', 'Environment'),
('Digital Literacy Program', '/sk-logo.png', 'February 2024', 'Technology'),
('Sports Development Program', '/sk-logo.png', 'January 2024', 'Sports'),
('Arts and Culture Festival', '/sk-logo.png', 'April 2024', 'Culture')
ON CONFLICT DO NOTHING;

