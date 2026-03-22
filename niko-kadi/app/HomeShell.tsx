"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import BottomNav from "@/components/layout/BottomNav";
import BottomSheet, { type SnapPoint } from "@/components/ui/BottomSheet";
import StationCard from "@/components/ui/StationCard";

const FullScreenMap = dynamic(() => import("@/components/map/FullScreenMap"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gray-200" aria-hidden />,
});

interface ConstituencyItem {
  slug: string;
  name: string;
  county: string;
  county_slug: string;
  status: string;
  confirmations: number;
  has_coordinates: boolean;
}

interface StatsData {
  verified: number;
  pending: number;
  total_constituencies: number;
  total_contributions: number;
  total_contributors: number;
}

interface HomeShellProps {
  initialData: ConstituencyItem[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: StatsData | null;
  initialSearch?: string;
  initialStatus?: string;
}

export default function HomeShell({
  initialData,
  initialPagination,
  stats,
  initialSearch = "",
  initialStatus = "",
}: HomeShellProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [results, setResults] = useState(initialData);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [sheetSnap, setSheetSnap] = useState<SnapPoint>("half");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResults = useCallback(
    async (search: string, status: string, page = 1) => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (status && status !== "all") params.set("status", status);
      if (page > 1) params.set("page", String(page));

      try {
        const res = await fetch(`/api/constituencies?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          setResults(json.data);
          setPagination(json.pagination);
        }
      } catch {
        // keep current results
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetchResults(query, statusFilter);
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, statusFilter, fetchResults]);

  const handleStatusChange = (status: string) => {
    setStatusFilter(status === "all" ? "" : status);
  };

  const handleMarkerClick = useCallback(
    (slug: string) => {
      router.push(`/station/${slug}`);
    },
    [router]
  );

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages) {
      fetchResults(query, statusFilter, pagination.page + 1);
    }
  };

  const verifiedPct = stats
    ? Math.round((stats.verified / stats.total_constituencies) * 100)
    : 0;

  /* ── Peek content (search bar — visible in all sheet states) ── */
  const peekContent = (
    <div>
      {/* Desktop branding + nav */}
      <div className="hidden md:flex items-center justify-between mb-3">
        <Link href="/" className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-base font-bold text-green-700">findmystation</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label htmlFor="search-input" className="sr-only">Search stations</label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search-input"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (sheetSnap === "peek") setSheetSnap("half");
              }}
              onFocus={() => {
                if (sheetSnap === "peek") setSheetSnap("half");
              }}
              placeholder="Search constituency or location..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-gray-100 text-sm placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus:bg-white border-0"
            />
          </div>
        </div>
        {stats && (
          <div className="flex-shrink-0 text-right" aria-label={`${verifiedPct}% verified`}>
            <p className="text-xs font-bold text-green-700">{verifiedPct}%</p>
            <p className="text-xs text-gray-400">verified</p>
          </div>
        )}
      </div>
    </div>
  );

  /* ── Desktop nav links (bottom of side panel) ── */
  const navLinks = (
    <nav aria-label="Site navigation" className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-4">
        <Link href="/about" className="text-gray-500 hover:text-green-700 transition-colors">
          About
        </Link>
        <Link href="/contribute" className="text-gray-500 hover:text-green-700 transition-colors">
          How to Help
        </Link>
      </div>
      <span className="text-xs text-gray-300">findmystation</span>
    </nav>
  );

  return (
    <div className="h-full relative">
      {/* Skip to content */}
      <a
        href="#station-list"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-green-700 focus:font-medium"
      >
        Skip to station list
      </a>

      {/* Map — offset left on desktop for side panel */}
      <div className="absolute inset-0 md:left-[420px] lg:left-[480px]" aria-hidden="true">
        <FullScreenMap onMarkerClick={handleMarkerClick} />
      </div>

      {/* ── Mobile floating header ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 pointer-events-none">
        <div
          className="flex items-center justify-between px-4 pb-2"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
        >
          <Link
            href="/"
            className="pointer-events-auto bg-white/90 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-md flex items-center gap-2"
            aria-label="findmystation home"
          >
            <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-bold text-green-700">findmystation</span>
          </Link>
        </div>
      </header>

      <BottomNav />

      {/* ── Bottom sheet (mobile) / Side panel (desktop) ── */}
      <BottomSheet
        defaultSnap="half"
        peekContent={peekContent}
        navLinks={navLinks}
        onSnapChange={setSheetSnap}
      >
        <main id="station-list">
          {/* Filter chips */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 -mx-1 px-1" role="group" aria-label="Filter by status">
            {[
              { value: "all", label: "All" },
              { value: "verified", label: "Verified" },
              { value: "pending", label: "Confirming" },
              { value: "unverified", label: "Needs GPS" },
            ].map(({ value, label }) => {
              const isActive =
                (value === "all" && !statusFilter) || statusFilter === value;
              return (
                <button
                  key={value}
                  onClick={() => handleStatusChange(value)}
                  role="radio"
                  aria-checked={isActive}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 ${
                    isActive
                      ? "bg-green-700 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Stats summary */}
          {stats && (
            <div className="grid grid-cols-4 gap-2 mb-3 p-3 bg-gray-50 rounded-xl" aria-label="Verification statistics">
              <div className="text-center">
                <p className="text-lg font-bold text-green-700">{stats.verified}</p>
                <p className="text-xs text-gray-500">Verified</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-600">{stats.total_contributions}</p>
                <p className="text-xs text-gray-500">Pins</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-600">{stats.total_contributors}</p>
                <p className="text-xs text-gray-500">People</p>
              </div>
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500" aria-live="polite">
              {loading ? "Searching..." : `${pagination.total} stations`}
            </p>
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-xs text-green-700 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded px-1"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          {/* Results list */}
          <div className="space-y-3" role="list" aria-label="Stations">
            {results.length === 0 ? (
              <div className="text-center py-8 text-gray-400" role="status">
                <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-sm font-medium">No stations found</p>
                <p className="text-xs mt-0.5">Try a different search</p>
              </div>
            ) : (
              results.map((station) => (
                <div key={station.slug} role="listitem">
                  <StationCard {...station} />
                </div>
              ))
            )}
          </div>

          {/* Load more */}
          {pagination.page < pagination.pages && (
            <button
              onClick={handleLoadMore}
              className="w-full mt-3 py-2.5 text-sm font-medium text-green-700 bg-green-50 rounded-xl hover:bg-green-100 active:bg-green-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
            >
              Load more ({pagination.total - results.length} remaining)
            </button>
          )}

          {/* Spacer for mobile tab bar */}
          <div className="h-16 md:h-4" />
        </main>
      </BottomSheet>
    </div>
  );
}
