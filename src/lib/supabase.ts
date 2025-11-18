import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  date: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

