import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

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
        .from('gallery')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data || []);
    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ error: 'Failed to fetch gallery items' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, image, date, category } = req.body;

      if (!title || !image || !date || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { data, error } = await supabase
        .from('gallery')
        .insert([{ title, image, date, category }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data);
    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ error: 'Failed to create gallery item' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, title, image, date, category } = req.body;

      if (!id || !title || !image || !date || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { data, error } = await supabase
        .from('gallery')
        .update({ title, image, date, category })
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
      return res.status(500).json({ error: 'Failed to update gallery item' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Missing gallery item ID' });
      }

      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ message: 'Gallery item deleted successfully' });
    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ error: 'Failed to delete gallery item' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

