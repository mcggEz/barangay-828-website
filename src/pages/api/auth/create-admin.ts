import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

/**
 * This endpoint is for creating the first admin user.
 * IMPORTANT: After creating your first admin, you should:
 * 1. Remove or secure this endpoint
 * 2. Add proper authentication to this endpoint
 * 3. Or disable it in production
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional: Add a secret key check for security
  const secretKey = req.headers['x-secret-key'] || req.body.secretKey;
  const expectedSecret = process.env.ADMIN_CREATE_SECRET_KEY;

  if (expectedSecret && secretKey !== expectedSecret) {
    return res.status(401).json({ error: 'Unauthorized. Secret key required.' });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ 
      error: 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file' 
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { username, password, email, full_name } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if username already exists
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('id')
      .eq('username', username)
      .single();

    if (existingAdmin) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create admin user
    const { data: admin, error: createError } = await supabase
      .from('admins')
      .insert([{
        username,
        password_hash,
        email: email || null,
        full_name: full_name || null,
        is_active: true
      }])
      .select()
      .single();

    if (createError) {
      console.error('Create admin error:', createError);
      return res.status(500).json({ error: 'Failed to create admin user' });
    }

    return res.status(201).json({ 
      success: true,
      message: 'Admin user created successfully',
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

