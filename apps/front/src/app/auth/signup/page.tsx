// SignUpPage.tsx
import Link from "next/link";
import SignUpForm from "./_components/signUpForm";

const SignUpPage = () => {
  return (
    <div className="flex w-full min-h-screen">
      {/* Left Side - Form */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          <h2 className="text-center text-3xl font-bold mb-8 text-gray-900">
            Create Account
          </h2>
          <SignUpForm />
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-2">Already have an account?</p>
            <Link 
              className="text-blue-600 hover:text-blue-800 underline font-medium" 
              href={"/auth/signin"}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-center text-white p-8">
          {/* Placeholder untuk gambar - ganti dengan gambar sesuai kebutuhan */}
          <div className="mb-6">
            <svg 
              className="w-32 h-32 mx-auto mb-6 text-white/80" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4">Welcome to Our Platform</h3>
          <p className="text-lg text-white/90">
            Join thousands of users who trust our secure and reliable service.
          </p>
          
          {/* Alternative: Jika ingin menggunakan gambar nyata, uncomment dan ganti src */}
          {/* 
          <img 
            src="/your-image-path.jpg" 
            alt="Sign up illustration" 
            className="w-full max-w-md mx-auto rounded-lg shadow-lg"
          />
          */}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;