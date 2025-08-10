import { BACKEND_URL } from "./constants";
import { getSession } from "./session";

export const fetchGraphQL = async (query: string, variables = {}) => {
  const response = await fetch(`${BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();
  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error("Failed to fetch the data from GraphQL");
  }

  return result.data;
};

export const authFetchGraphQL = async (query: string, variables = {}) => {
  const session = await getSession();
  const response = await fetch(`${BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();
  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error("Failed to fetch the data from GraphQL");
  }

  return result.data;
};

// Function khusus untuk forgot password
export const forgotPassword = async (email: string) => {
  const FORGOT_PASSWORD_MUTATION = `
    mutation ForgotPassword($email: String!) {
      forgotPassword(forgotPasswordInput: { email: $email })
    }
  `;

  try {
    const result = await fetchGraphQL(FORGOT_PASSWORD_MUTATION, { email });
    return result.forgotPassword;
  } catch (error) {
    console.error("Forgot password error:", error);
    throw new Error("Failed to send forgot password request");
  }
};

// Function untuk validasi reset token
export const validateResetToken = async (token: string) => {
  const VALIDATE_RESET_TOKEN_QUERY = `
    query ValidateResetToken($token: String!) {
      validateResetToken(validateResetTokenInput: { token: $token })
    }
  `;

  try {
    const result = await fetchGraphQL(VALIDATE_RESET_TOKEN_QUERY, { token });
    return result.validateResetToken;
  } catch (error) {
    console.error("Validate reset token error:", error);
    throw new Error("Invalid or expired reset token");
  }
};

// Function untuk reset password
export const resetPassword = async (token: string, newPassword: string) => {
  const RESET_PASSWORD_MUTATION = `
    mutation ResetPassword($token: String!, $newPassword: String!) {
      resetPassword(resetPasswordInput: { 
        token: $token, 
        newPassword: $newPassword 
      })
    }
  `;

  try {
    const result = await fetchGraphQL(RESET_PASSWORD_MUTATION, { 
      token, 
      newPassword 
    });
    return result.resetPassword;
  } catch (error) {
    console.error("Reset password error:", error);
    throw new Error("Failed to reset password");
  }
};