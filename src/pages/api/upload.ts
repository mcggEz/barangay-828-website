import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabase || !supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({
      error: 'Supabase service role is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    });
  }

  const { bucket, path, fileData, contentType } = req.body as {
    bucket?: string;
    path?: string;
    fileData?: string;
    contentType?: string;
  };

  if (!bucket || !path || !fileData) {
    return res.status(400).json({ error: 'Bucket, path, and fileData are required.' });
  }

  let base64String = fileData;
  let detectedContentType = contentType;
  const matches = /^data:(.+);base64,(.+)$/.exec(fileData);
  if (matches) {
    detectedContentType = detectedContentType || matches[1];
    base64String = matches[2];
  }

  try {
    const buffer = Buffer.from(base64String, 'base64');

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: detectedContentType || 'application/octet-stream',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(500).json({ error: uploadError.message });
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return res.status(200).json({ publicUrl: data.publicUrl });
  } catch (error) {
    console.error('Upload unexpected error:', error);
    return res.status(500).json({ error: 'Failed to upload file.' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};
