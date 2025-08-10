"use client";

import dynamic from "next/dynamic";
import { updatePost } from "@/lib/actions/postActions";
import { Post } from "@/lib/types/modelTypes";
import { useActionState } from "react";

// dynamic import -> mencegah load di server
const UpsertPostForm = dynamic(
  () => import("@/app/user/create-post/_components/upsertPostForm"),
  { ssr: false }
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

  return <UpsertPostForm state={state} formAction={action} />;
};

export default UpdatePostContainer;
