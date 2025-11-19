import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { Announcement } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!supabase) {
    return res.status(500).json({ 
      error: 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file' 
    });
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data || []);
    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, category, date } = req.body;

      if (!title || !description || !category || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { data, error } = await supabase
        .from('announcements')
        .insert([{ title, description, category, date }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data);
    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ error: 'Failed to create announcement' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, title, description, category, date } = req.body;

      if (!id || !title || !description || !category || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { data, error } = await supabase
        .from('announcements')
        .update({ title, description, category, date })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ error: 'Failed to update announcement' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Missing announcement ID' });
      }

      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ error: 'Failed to delete announcement' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

