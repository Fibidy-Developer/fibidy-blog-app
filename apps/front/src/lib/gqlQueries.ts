import gql from "graphql-tag";

export const GET_POSTS = gql`
  query posts($skip: Float, $take: Float) {
    posts(skip: $skip, take: $take) {
      id
      title
      thumbnail
      content
      createdAt
      slug
    }
    postCount
  }
`;

export const GET_POST_BY_ID = gql`
  query getPostById($id: Int!) {
    getPostById(id: $id) {
      id
      title
      thumbnail
      content
      createdAt
      published
      author {
        name
      }
      tags {
        id
        name
      }
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
      id
    }
  }
`;

// Mutation untuk forgot password
export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(forgotPasswordInput: { email: $email })
  }
`;

// Query untuk validasi reset token
export const VALIDATE_RESET_TOKEN = gql`
  query ValidateResetToken($token: String!) {
    validateResetToken(validateResetTokenInput: { token: $token })
  }
`;

// Mutation untuk reset password
export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(resetPasswordInput: { 
      token: $token, 
      newPassword: $newPassword 
    })
  }
`;

export const SIGN_IN_MUTATION = gql`
  mutation signIn($input: SignInInput!) {
    signIn(signInInput: $input) {
      id
      name
      avatar
      accessToken
    }
  }
`;

export const UPDATE_COMMENT_MUTATION = gql`
  mutation updateComment($input: UpdateCommentInput!) {
    updateComment(updateCommentInput: $input) {
      id
      content
      updatedAt
    }
  }
`;
export const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($commentId: Int!) {
    deleteComment(commentId: $commentId)
  }
`;

export const GET_POST_COMMENTS = gql`
  query getPostComments($postId: Int!, $take: Int, $skip: Int) {
    getPostComments(postId: $postId, take: $take, skip: $skip) {
      id
      content
      createdAt
      updatedAt
      author {
        id
        name
        avatar
      }
    }

    postCommentCount(postId: $postId)
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($input: CreateCommentInput!) {
    createComment(createCommentInput: $input) {
      id
    }
  }
`;

export const POST_LIKES = gql`
  query PostLikeData($postId: Int!) {
    postLikesCount(postId: $postId)
    userLikedPost(postId: $postId)
  }
`;

export const LIKE_POST_MUTATION = gql`
  mutation LikePost($postId: Int!) {
    likePost(postId: $postId)
  }
`;

export const UNLIKE_POST_MUTATION = gql`
  mutation UnLikePost($postId: Int!) {
    unlikePost(postId: $postId)
  }
`;

export const GET_USER_POSTS = gql`
  query GetUserPosts($skip: Int, $take: Int) {
    getUserPosts(skip: $skip, take: $take) {
      id
      title
      slug
      thumbnail
      published
      createdAt
      content
      _count {
        likes
        comments
      }
    }
    userPostCount
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation CreatePostMutation($input: CreatePostInput!) {
    createPost(createPostInput: $input) {
      id
    }
  }
`;

export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(updatePostInput: $input) {
      id
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation DeletePost($postId: Int!) {
    deletePost(postId: $postId)
  }
`;