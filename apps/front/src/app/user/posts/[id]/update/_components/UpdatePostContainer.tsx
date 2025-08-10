"use client";

import dynamic from "next/dynamic";
import { updatePost } from "@/lib/actions/postActions";
import { Post } from "@/lib/types/modelTypes";
import { useActionState } from "react";
import { useState, useEffect } from "react";

// Dynamic import dengan loading fallback
const UpsertPostForm = dynamic(
  () => import("@/app/user/create-post/_components/upsertPostForm"),
  { 
    ssr: false,
    loading: () => <div>Loading form...</div>
  }
);

type Props = {
  post: Post;
};

const UpdatePostContainer = ({ post }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  console.log({ post });

  const [state, action] = useActionState(updatePost, {
    data: {
      postId: post.id,
      title: post.title || "",
      content: post.content || "",
      published: Boolean(post.published),
      tags: post.tags?.map((tag) => tag.name).join(",") || "",
      previousThumbnailUrl: post.thumbnail ?? undefined,
    },
  });

  // Hanya render setelah component mounted di client
  if (!isMounted) {
    return <div>Loading form...</div>;
  }

  return <UpsertPostForm state={state} formAction={action} />;
};

export default UpdatePostContainer;