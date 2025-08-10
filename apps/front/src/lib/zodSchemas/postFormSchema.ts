import { z } from "zod";

export const PostFormSchema = z.object({
  postId: z
    .string()
    .transform((value) => parseInt(value))
    .optional(),
  title: z.string().min(5).max(100),
  content: z.string().min(20),
  tags: z
    .string()
    .min(1)
    .refine((value) => value.split(",").every((tag) => tag.trim() !== ""))
    .transform((value) => value.split(",")),
  // Fixed: Use any() instead of instanceof(File) for server compatibility
  thumbnail: z
    .any()
    .optional()
    .refine((file) => {
      // Only validate if file exists and is in browser environment
      if (!file || typeof window === 'undefined') return true;
      
      // Check if it's a File object
      if (!(file instanceof File)) return false;
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) return false;
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      return allowedTypes.includes(file.type);
    }, {
      message: "Please upload a valid image file (JPEG, PNG, GIF, WEBP) under 5MB"
    }),
  published: z.string().transform((value) => value === "on"),
});