// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const RESET_PASSWORD_MUTATION = `
      mutation ResetPassword($token: String!, $newPassword: String!) {
        resetPassword(resetPasswordInput: { 
          token: $token, 
          newPassword: $newPassword 
        })
      }
    `;

    const response = await fetch(`${BACKEND_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: RESET_PASSWORD_MUTATION,
        variables: { token, newPassword },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return NextResponse.json(
        { error: 'Failed to reset password. Token may be invalid or expired.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Password reset successfully' 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}