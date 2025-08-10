"use client";

import { updatePost } from "@/lib/actions/postActions";
import { Post } from "@/lib/types/modelTypes";
import { useActionState } from "react";
import { Suspense, lazy } from "react";

// Lazy load component
const UpsertPostForm = lazy(
  () => import("@/app/user/create-post/_components/upsertPostForm")
);

type Props = {
  post: Post;
};

const UpdatePostContainer = ({ post }: Props) => {
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

  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <UpsertPostForm state={state} formAction={action} />
    </Suspense>
  );
};

export default UpdatePostContainer;