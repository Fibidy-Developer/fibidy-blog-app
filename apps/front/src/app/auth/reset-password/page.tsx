// app/auth/reset-password/page.tsx
import { Suspense } from 'react';
import ResetPasswordContent from './_components/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div className="flex w-full min-h-screen">
      {/* Left Side - Form */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <Suspense fallback={
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        }>
          <ResetPasswordContent />
        </Suspense>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <div className="mb-6">
            <svg 
              className="w-32 h-32 mx-auto mb-6 text-white/80" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4">Secure Password Reset</h3>
          <p className="text-lg text-white/90">
            Create a strong new password to keep your account safe and secure.
          </p>
        </div>
      </div>
    </div>
  );
}