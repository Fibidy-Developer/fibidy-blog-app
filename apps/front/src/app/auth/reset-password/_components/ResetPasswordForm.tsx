// _components/ResetPasswordContent.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setMessage('Invalid reset link. Please request a new password reset.');
        setIsValidating(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/validate-reset-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (response.ok && result.valid) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          setMessage('This reset link is invalid or has expired. Please request a new password reset.');
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsTokenValid(false);
        setMessage('This reset link is invalid or has expired. Please request a new password reset.');
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setMessage('Please fill in all fields');
      setIsSuccess(false);
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setIsSuccess(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Password reset successful! You can now sign in with your new password.');
        
        // Redirect to sign in page after 3 seconds
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      } else {
        setIsSuccess(false);
        setMessage(result.error || 'Failed to reset password. Please try again.');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsSuccess(false);
      setMessage('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while validating token
  if (isValidating) {
    return (
      <div className="w-full max-w-md p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isTokenValid) {
    return (
      <div className="w-full max-w-md p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h2>
          <div className="p-3 rounded-md text-sm bg-red-50 text-red-700 border border-red-200 mb-6">
            {message}
          </div>
          <div className="space-y-3">
            <Link 
              href="/auth/forgot"
              className="block w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
            >
              Request New Reset Link
            </Link>
            <Link 
              href="/auth/signin"
              className="block text-blue-600 hover:text-blue-800 underline font-medium text-center"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8">
      <div>
        <h1 className="text-center text-3xl font-bold text-gray-900 mb-8">
          Reset Password
        </h1>
        <p className="text-center text-sm text-gray-600 mb-8">
          Enter your new password below.
        </p>
      </div>
      
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter new password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="text-gray-400 hover:text-gray-600 text-sm">
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirm new password"
            disabled={isLoading}
          />
        </div>

        {message && (
          <div className={`p-3 rounded-md text-sm ${
            isSuccess 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
            {isSuccess && (
              <p className="mt-1 text-xs">Redirecting to sign in page...</p>
            )}
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Resetting Password...
              </div>
            ) : isSuccess ? (
              'Password Reset Successfully'
            ) : (
              'Reset Password'
            )}
          </button>
        </div>

        {!isSuccess && (
          <div className="mt-6 flex items-center justify-center space-x-4 text-sm">
            <Link 
              href="/auth/signin" 
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Back to Sign In
            </Link>
            <span className="text-gray-400">|</span>
            <Link 
              href="/auth/forgot" 
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Request New Link
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}