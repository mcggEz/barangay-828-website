-- Migration: Create announcements table
-- Created: 2024
-- Description: Creates the announcements table for storing community announcements

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index on date for faster sorting
CREATE INDEX IF NOT EXISTS idx_announcements_date ON public.announcements(date DESC);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_announcements_category ON public.announcements(category);

-- Enable Row Level Security (RLS)
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read announcements
CREATE POLICY "Anyone can read announcements"
  ON public.announcements
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert/update/delete
-- Note: You can modify this based on your authentication setup
CREATE POLICY "Authenticated users can manage announcements"
  ON public.announcements
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - comment out if not needed)
INSERT INTO public.announcements (title, description, category, date) VALUES
('Community Clean-up Drive', 'Join us for our monthly community clean-up drive. Meet at the barangay hall at 7:00 AM.', 'Event', 'March 15, 2024'),
('Free Medical Check-up', 'Free medical check-up for senior citizens and PWDs. Bring your barangay ID.', 'Health', 'March 20, 2024'),
('Road Closure Notice', 'Main street will be closed for maintenance from March 12-14. Please use alternate routes.', 'Notice', 'March 10, 2024')
ON CONFLICT DO NOTHING;

