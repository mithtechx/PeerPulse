import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Client-side image compression using Canvas API before uploading.
 */
export async function compressAndUploadImage(
  file: File,
  folder: 'doubts' | 'equipment' | 'lost-found'
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 1024;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        async (blob) => {
          if (!blob) return reject(new Error('Compression failed'));
          const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpeg`;

          const { data, error } = await supabase.storage
            .from('peerpulse-media')
            .upload(fileName, blob, { contentType: 'image/jpeg' });

          if (error) {
            console.error('Storage Upload Error:', error);
            return resolve(null);
          }

          const { data: publicUrlData } = supabase.storage
            .from('peerpulse-media')
            .getPublicUrl(data.path);

          resolve(publicUrlData.publicUrl);
        },
        'image/jpeg',
        0.75
      );
    };
    img.onerror = (err) => reject(err);
  });
}