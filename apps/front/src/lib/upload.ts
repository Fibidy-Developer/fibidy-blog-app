// lib/upload-client.ts
import { createClient } from "@supabase/supabase-js";

export async function uploadThumbnail(image: File | Blob) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const fileName = image instanceof File ? image.name : `upload_${Date.now()}`;
  
  const data = await supabase.storage
    .from("thumbnails")
    .upload(`${fileName}_${Date.now()}`, image);

  if (!data.data?.path) throw new Error("failed to upload the file");
  
  const urlData = await supabase.storage
    .from("thumbnails")
    .getPublicUrl(data.data?.path);

  return urlData.data.publicUrl;
}