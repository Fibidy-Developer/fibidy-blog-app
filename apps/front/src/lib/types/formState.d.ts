export type SignUpFormState =
  | {
      data: {
        name?: string;
        email?: string;
        password?: string;
      };
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type CreateCommentFormState =
  | {
      data?: {
        content?: string;
        postId?: number;
      };
      errors?: {
        content?: string[];
      };
      message?: string;
      ok?: boolean;
      open?: boolean;
    }
  | undefined;

export type PostFormState =
  | {
      data?: {
        postId?: number; // untuk edit
        title?: string;
        content?: string;
        thumbnail?: File | null;
        tags?: string; // comma-separated atau input string mentah
        published?: boolean; // disarankan boolean
        previousThumbnailUrl?: string; // untuk preview gambar lama
      };

      errors?: {
        title?: string[];
        content?: string[];
        thumbnail?: string[];
        tags?: string[];
        published?: string[]; // disesuaikan dengan nama field data
      };

      message?: string;
      ok?: boolean;
    }
  | undefined;
