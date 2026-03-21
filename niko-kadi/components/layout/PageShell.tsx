import Link from "next/link";

interface PageShellProps {
  children: React.ReactNode;
  title?: string;
}

export default function PageShell({ children, title }: PageShellProps) {
  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* Skip link */}
      <a
        href="#page-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-green-700 focus:font-medium"
      >
        Skip to content
      </a>

      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded"
            aria-label="Back to map"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back to Map</span>
            <span className="sm:hidden">Map</span>
          </Link>
          {title && (
            <>
              <span className="text-gray-300" aria-hidden="true">|</span>
              <span className="text-sm font-semibold text-gray-900 truncate">{title}</span>
            </>
          )}

          {/* Desktop nav */}
          <nav aria-label="Site navigation" className="hidden sm:flex items-center gap-4 ml-auto text-sm text-gray-500">
            <Link href="/" className="hover:text-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded">Home</Link>
            <Link href="/about" className="hover:text-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded">About</Link>
            <Link href="/contribute" className="hover:text-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded">How to Help</Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main id="page-content" className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-16 sm:pb-8">
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="Main navigation"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center justify-around h-14">
          <Link href="/" className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </Link>
          <Link href="/about" className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About
          </Link>
          <Link href="/contribute" className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Help
          </Link>
        </div>
      </nav>
    </div>
  );
}
