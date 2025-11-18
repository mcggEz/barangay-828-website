# Supabase Setup Guide

This guide will help you set up Supabase for dynamic announcements and gallery data.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: `barangay-828` (or any name you prefer)
   - Database Password: (save this securely)
   - Region: Choose the closest region to your users
5. Click "Create new project" and wait for it to finish setting up

## 2. Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 4. Create Database Tables

In your Supabase project, go to **SQL Editor** and run the following SQL:

### Announcements Table

```sql
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read announcements
CREATE POLICY "Anyone can read announcements"
  ON announcements
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert/update/delete (you can modify this based on your needs)
CREATE POLICY "Authenticated users can manage announcements"
  ON announcements
  FOR ALL
  USING (auth.role() = 'authenticated');
```

### Gallery Table

```sql
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read gallery items
CREATE POLICY "Anyone can read gallery"
  ON gallery
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to manage gallery items
CREATE POLICY "Authenticated users can manage gallery"
  ON gallery
  FOR ALL
  USING (auth.role() = 'authenticated');
```

## 5. Insert Sample Data (Optional)

### Sample Announcements

```sql
INSERT INTO announcements (title, description, category, date) VALUES
('Community Clean-up Drive', 'Join us for our monthly community clean-up drive. Meet at the barangay hall at 7:00 AM.', 'Event', 'March 15, 2024'),
('Free Medical Check-up', 'Free medical check-up for senior citizens and PWDs. Bring your barangay ID.', 'Health', 'March 20, 2024'),
('Road Closure Notice', 'Main street will be closed for maintenance from March 12-14. Please use alternate routes.', 'Notice', 'March 10, 2024');
```

### Sample Gallery Items

```sql
INSERT INTO gallery (title, image, date, category) VALUES
('Community Event', '/sk-logo.png', 'January 2024', 'Events'),
('Youth Leadership Training', '/sk-logo.png', 'January 2024', 'Education'),
('Community Garden Initiative', '/sk-logo.png', 'December 2023', 'Environment');
```

## 6. Storage for Images (Optional)

If you want to upload images to Supabase Storage instead of using public URLs:

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `gallery-images`
3. Set it to public
4. Update the gallery table to store the image path from Supabase Storage

## 7. Test Your Setup

1. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

2. Visit:
   - `http://localhost:3000/announcements` - Should show announcements from database
   - `http://localhost:3000/gallery` - Should show gallery items from database

## Troubleshooting

- **No data showing?** Check that you've inserted sample data in step 5
- **Connection errors?** Verify your environment variables are correct
- **Permission errors?** Check your RLS policies are set correctly

## Admin Panel Integration (Future)

You can later integrate the admin panel to allow CRUD operations through the Supabase API. This would require:
1. Setting up authentication in Supabase
2. Creating admin users
3. Updating the admin panel to use Supabase API calls

