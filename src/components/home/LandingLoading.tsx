export function LandingLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="mb-4 size-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="font-medium text-gray-600 dark:text-gray-300">
          Loading your services...
        </p>
      </div>
    </main>
  );
}
