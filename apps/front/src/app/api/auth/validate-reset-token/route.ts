// app/api/auth/validate-reset-token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required', valid: false },
        { status: 400 }
      );
    }

    const VALIDATE_RESET_TOKEN_QUERY = `
      query ValidateResetToken($token: String!) {
        validateResetToken(validateResetTokenInput: { token: $token })
      }
    `;

    const response = await fetch(`${BACKEND_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: VALIDATE_RESET_TOKEN_QUERY,
        variables: { token },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return NextResponse.json(
        { error: 'Invalid or expired token', valid: false },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      valid: result.data.validateResetToken,
      message: 'Token is valid' 
    });

  } catch (error) {
    console.error('Validate reset token error:', error);
    return NextResponse.json(
      { error: 'Internal server error', valid: false },
      { status: 500 }
    );
  }
}