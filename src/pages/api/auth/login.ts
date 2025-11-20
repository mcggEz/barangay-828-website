import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[Login API] Missing Supabase env vars', {
      hasUrl: Boolean(supabaseUrl),
      hasServiceKey: Boolean(supabaseServiceKey),
    });
    return res.status(500).json({ 
      error: 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file' 
    });
  }

  // Use service role key to bypass RLS for admin table
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      console.warn('[Login API] Missing username or password in request body');
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Fetch admin from database
    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single();

    if (fetchError || !admin) {
      console.warn('[Login API] Admin not found or inactive', {
        username,
        fetchError: fetchError?.message,
      });
      // Don't reveal if username exists or not (security best practice)
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);

    if (!isValidPassword) {
      console.warn('[Login API] Invalid password attempt', { username });
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Update last_login timestamp
    await supabase
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    // Set authentication cookie
    const cookieOptions = [
      'adminAuth=true',
      'path=/',
      'max-age=86400', // 24 hours
      'HttpOnly',
      'SameSite=Strict',
      process.env.NODE_ENV === 'production' ? 'Secure' : ''
    ].filter(Boolean).join('; ');

    res.setHeader('Set-Cookie', cookieOptions);

    console.log('[Login API] Login successful', { username });
    return res.status(200).json({ 
      success: true,
      message: 'Login successful',
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name
      }
    });
  } catch (error) {
    console.error('[Login API] Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

