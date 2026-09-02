/**
 * Offline Fallback Page
 *
 * Displayed when the user has no network connection
 * and the requested page is not cached by the service worker.
 */
export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-950 px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-800">
        <svg
          className="h-10 w-10 text-surface-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white">You&apos;re Offline</h1>
      <p className="mt-2 max-w-sm text-surface-400">
        It looks like you&apos;ve lost your internet connection. Some features may be
        limited until you reconnect.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="btn-primary mt-8"
      >
        Try Again
      </button>
    </div>
  );
}
