// apps/front/app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      {/* Hero Section - Simplified */}
      <main className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          FIBIDY <span className="text-blue-600">BLOG APP</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Share your thoughts and connect with writers
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="#"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            COMING
          </Link>
          <Link
            href="#"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 font-medium"
          >
            SOON
          </Link>
        </div>
      </main>
    </div>
  )
}