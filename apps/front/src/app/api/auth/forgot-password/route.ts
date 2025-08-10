// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const FORGOT_PASSWORD_MUTATION = `
      mutation ForgotPassword($email: String!) {
        forgotPassword(forgotPasswordInput: { email: $email })
      }
    `;

    const response = await fetch(`${BACKEND_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: FORGOT_PASSWORD_MUTATION,
        variables: { email },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Reset instructions sent to your email' 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}