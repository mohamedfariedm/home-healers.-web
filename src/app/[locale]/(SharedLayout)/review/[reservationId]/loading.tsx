export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate-pulse">
          {/* Header skeleton */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="h-8 bg-gray-200 rounded-lg w-48 mx-auto mb-2" />
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
          </div>

          {/* Form skeleton */}
          <div className="space-y-6">
            {/* Section 1 */}
            <div className="p-5 bg-gray-50 rounded-xl">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
              <div className="flex justify-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-10 h-10 bg-gray-200 rounded-full" />
                ))}
              </div>
              <div className="h-24 bg-gray-200 rounded-xl" />
            </div>

            {/* Section 2 */}
            <div className="p-5 bg-gray-50 rounded-xl">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
              <div className="flex justify-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-10 h-10 bg-gray-200 rounded-full" />
                ))}
              </div>
              <div className="h-24 bg-gray-200 rounded-xl" />
            </div>

            {/* Button skeleton */}
            <div className="h-14 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
