"use server";
import { print } from "graphql";
import { authFetchGraphQL, fetchGraphQL } from "../fetchGraphQL";
import { 
  CREATE_COMMENT_MUTATION, 
  GET_POST_COMMENTS, 
  UPDATE_COMMENT_MUTATION, 
  DELETE_COMMENT_MUTATION 
} from "../gqlQueries";
import { CreateCommentFormState } from "../types/formState";
import { CommentEntity } from "../types/modelTypes";
import { CommentFormSchema } from "../zodSchemas/commentFormSchema";

export async function getPostComments({
  postId,
  skip,
  take,
}: {
  postId: number;
  skip: number;
  take: number;
}) {
  const data = await fetchGraphQL(print(GET_POST_COMMENTS), {
    postId,
    take,
    skip,
  });

  if (!data) {
    return {
      comments: [],
      count: 0,
    };
  }

  return {
    comments: data.getPostComments as CommentEntity[] || [],
    count: data.postCommentCount as number || 0,
  };
}

export async function saveComment(
  state: CreateCommentFormState,
  formData: FormData
): Promise<CreateCommentFormState> {
  const validatedFields = CommentFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      data: Object.fromEntries(formData.entries()),
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = await authFetchGraphQL(print(CREATE_COMMENT_MUTATION), {
    input: {
      ...validatedFields.data,
    },
  });

  if (data?.createComment) {
    return {
      message: "Success! Your comment saved!",
      ok: true,
      open: false,
    };
  }

  return {
    message: "Oops! Something went wrong!",
    ok: false,
    open: true,
    data: Object.fromEntries(formData.entries()),
  };
}

export async function updateComment({
  id,
  content,
}: {
  id: number;
  content: string;
}) {
  try {
    const data = await authFetchGraphQL(print(UPDATE_COMMENT_MUTATION), {
      input: {
        id,
        content,
      },
    });

    if (data?.updateComment) {
      return {
        success: true,
        comment: data.updateComment as CommentEntity,
      };
    }

    throw new Error("Failed to update comment");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to update comment");
  }
}

export async function deleteComment(commentId: number) {
  try {
    const data = await authFetchGraphQL(print(DELETE_COMMENT_MUTATION), {
      commentId: commentId,
    });

    if (data && data.deleteComment !== undefined) {
      return {
        success: true,
        message: "Comment deleted successfully",
      };
    }

    return {
      success: false,
      message: "Comment could not be deleted",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete comment",
    };
  }
}