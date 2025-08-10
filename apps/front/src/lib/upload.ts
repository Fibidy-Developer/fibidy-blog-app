import { createClient } from "@supabase/supabase-js";

// Define interface instead of using File constructor
interface UploadableFile {
  name?: string;
  size: number;
  type: string;
  arrayBuffer(): Promise<ArrayBuffer>;
  slice(start?: number, end?: number, contentType?: string): Blob;
  stream(): ReadableStream<Uint8Array>;
  text(): Promise<string>;
}

export async function uploadThumbnail(image: UploadableFile) {
  // Check if running on client side
  if (typeof window === 'undefined') {
    throw new Error('uploadThumbnail must be called on client-side only');
  }

  // Use NEXT_PUBLIC_ env vars for client-side access
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY!;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables not configured');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Handle both File and Blob objects safely
  const fileName = (image as any).name || `upload_${Date.now()}`;
  
  const data = await supabase.storage
    .from("thumbnails")
    .upload(`${fileName}_${Date.now()}`, image as any);

  console.log({ data });

  if (!data.data?.path) throw new Error("failed to upload the file");
  
  const urlData = await supabase.storage
    .from("thumbnails")
    .getPublicUrl(data.data?.path);

  return urlData.data.publicUrl;
}