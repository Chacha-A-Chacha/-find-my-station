import Link from "next/link";

interface StationCardProps {
  slug: string;
  name: string;
  county: string;
  county_slug: string;
  status: string;
  confirmations: number;
  has_coordinates: boolean;
}

export default function StationCard({
  slug,
  name,
  county,
  status,
  confirmations,
  has_coordinates,
}: StationCardProps) {
  const isVerified = status === "verified";
  const isPending = status === "pending";

  return (
    <Link
      href={`/station/${slug}`}
      className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all active:scale-[0.98]"
    >
      {/* Left icon */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isVerified
            ? "bg-green-100"
            : isPending
              ? "bg-amber-50"
              : "bg-gray-100"
        }`}
      >
        {isVerified ? (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : isPending ? (
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 truncate">{name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{county} County</p>
        {isVerified && has_coordinates ? (
          <p className="text-xs text-green-600 font-medium mt-1">Get directions</p>
        ) : isPending ? (
          <p className="text-xs text-amber-600 mt-1">{confirmations}/7 confirmed</p>
        ) : (
          <p className="text-xs text-blue-600 mt-1">Help locate this office</p>
        )}
      </div>

      {/* Right chevron */}
      <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
