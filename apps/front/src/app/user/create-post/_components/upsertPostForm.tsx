"use client";

import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PostFormState } from "@/lib/types/formState";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  state: PostFormState;
  formAction: (payload: FormData) => void;
};

const UpsertPostForm = ({ state, formAction }: Props) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  // Ensure component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.ok ? "Success" : "Oops",
        description: state.message,
      });
    }
  }, [state, toast]);

  useEffect(() => {
    return () => {
      // Only revoke URL if we're on client and URL exists
      if (isMounted && imageUrl && typeof window !== 'undefined') {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl, isMounted]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only handle file changes on client side
    if (typeof window === 'undefined') return;
    
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 [&>div>label]:text-slate-500 [&>div>input]:transition [&>div>textarea]:transition"
    >
      {state?.data?.postId && (
        <input hidden name="postId" defaultValue={state.data.postId} />
      )}

      {/* Title */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter The Title of Your Post"
          defaultValue={state?.data?.title}
        />
        {!!state?.errors?.title && (
          <p className="text-red-500 animate-shake">{state.errors.title}</p>
        )}
      </div>

      {/* Content */}
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Write Your Post Content Here"
          rows={6}
          defaultValue={state?.data?.content}
        />
        {!!state?.errors?.content && (
          <p className="text-red-500 animate-shake">{state.errors.content}</p>
        )}
      </div>

      {/* Thumbnail */}
      <div>
        <Label htmlFor="thumbnail">Thumbnail</Label>
        <Input
          id="thumbnail"
          type="file"
          name="thumbnail"
          accept="image/*"
          onChange={handleFileChange}
        />
        {!!state?.errors?.thumbnail && (
          <p className="text-red-500 animate-shake">{state.errors.thumbnail}</p>
        )}
        {(imageUrl || state?.data?.previousThumbnailUrl) && (
          <Image
            src={imageUrl || state?.data?.previousThumbnailUrl || ""}
            alt="Post thumbnail"
            width={200}
            height={150}
            className="mt-2 rounded"
          />
        )}
      </div>

      {/* Tags */}
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="Enter tags (comma-separated)"
          defaultValue={state?.data?.tags}
        />
        {!!state?.errors?.tags && (
          <p className="text-red-500 animate-shake">{state.errors.tags}</p>
        )}
      </div>

      {/* Published Checkbox */}
      <div className="flex items-center">
        <input
          id="published"
          className="mx-2 w-4 h-4"
          type="checkbox"
          name="published"
          value="true"
          defaultChecked={state?.data?.published === true}
        />
        <Label htmlFor="published">Published Now</Label>
      </div>
      {!!state?.errors?.published && (
        <p className="text-red-500 animate-shake">{state.errors.published}</p>
      )}

      {/* Submit */}
      <SubmitButton>Save</SubmitButton>
    </form>
  );
};

export default UpsertPostForm;