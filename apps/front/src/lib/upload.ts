import { createClient } from "@supabase/supabase-js";

export async function uploadThumbnail(image: File | Blob) {
  // Use NEXT_PUBLIC_ env vars for client-side access
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_API_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Handle both File and Blob objects
  const fileName = image instanceof File ? image.name : `upload_${Date.now()}`;
  
  const data = await supabase.storage
    .from("thumbnails")
    .upload(`${fileName}_${Date.now()}`, image);

  console.log({ data });

  if (!data.data?.path) throw new Error("failed to upload the file");
  
  const urlData = await supabase.storage
    .from("thumbnails")
    .getPublicUrl(data.data?.path);

  return urlData.data.publicUrl;
}