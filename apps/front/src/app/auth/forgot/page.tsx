// app/auth/forgot/page.tsx
import ForgotPasswordForm from './_components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="flex w-full min-h-screen">
      {/* Left Side - Form */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <ForgotPasswordForm />
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="w-1/2 bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <div className="mb-6">
            <svg 
              className="w-32 h-32 mx-auto mb-6 text-white/80" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4">Check Your Email</h3>
          <p className="text-lg text-white/90">
            We&#39;ll send you a secure link to reset your password and get back into your account.
          </p>
        </div>
      </div>
    </div>
  );
}