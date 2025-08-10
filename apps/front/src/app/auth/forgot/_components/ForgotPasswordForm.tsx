// _components/ForgotPasswordForm.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Password reset instructions have been sent to your email address.');
      } else {
        setIsSuccess(false);
        setMessage(result.error || 'Failed to send reset instructions. Please try again.');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsSuccess(false);
      setMessage('Failed to send reset instructions. Please try again.');
    } 
  };

  return (
    <div className="w-full max-w-md p-8">
      <div>
        <h1 className="text-center text-3xl font-bold text-gray-900 mb-8">
          Forgot Password
        </h1>
        <p className="text-center text-sm text-gray-600 mb-8">
          Enter your email address and we&#39;ll send you instructions to reset your password.
        </p>
      </div>
      
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email address"
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
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              'Send Reset Instructions'
            )}
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center space-x-4 text-sm">
          <Link 
            href="/auth/signin" 
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            Back to Sign In
          </Link>
          <span className="text-gray-400">|</span>
          <Link 
            href="/auth/signup" 
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
}