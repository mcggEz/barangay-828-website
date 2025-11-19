-- Migration: Create gallery table
-- Created: 2024
-- Description: Creates the gallery table for storing community event photos and images

CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index on date for faster sorting
CREATE INDEX IF NOT EXISTS idx_gallery_date ON public.gallery(date DESC);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery(category);

-- Enable Row Level Security (RLS)
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read gallery items
CREATE POLICY "Anyone can read gallery"
  ON public.gallery
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert/update/delete
-- Note: You can modify this based on your authentication setup
CREATE POLICY "Authenticated users can manage gallery"
  ON public.gallery
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_gallery_updated_at
  BEFORE UPDATE ON public.gallery
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - comment out if not needed)
INSERT INTO public.gallery (title, image, date, category) VALUES
('Community Event', '/sk-logo.png', 'January 2024', 'Events'),
('Youth Leadership Training', '/sk-logo.png', 'January 2024', 'Education'),
('Community Garden Initiative', '/sk-logo.png', 'December 2023', 'Environment'),
('Digital Literacy Program', '/sk-logo.png', 'February 2024', 'Technology'),
('Sports Development Program', '/sk-logo.png', 'January 2024', 'Sports'),
('Arts and Culture Festival', '/sk-logo.png', 'April 2024', 'Culture')
ON CONFLICT DO NOTHING;

