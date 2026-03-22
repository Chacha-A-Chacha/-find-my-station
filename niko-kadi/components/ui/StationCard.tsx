import Link from "next/link";
import StatusBadge from "./StatusBadge";

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
      className="block p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{county} County</p>
        </div>
        {(isVerified || isPending || status === "flagged") && (
          <StatusBadge status={status} />
        )}
      </div>
      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
        {isVerified && has_coordinates ? (
          <span className="flex items-center gap-1 text-green-600">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            Get directions
          </span>
        ) : isPending ? (
          <span className="text-amber-600">{confirmations}/7 confirmations</span>
        ) : (
          <span className="flex items-center gap-1 text-blue-600">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Help locate this office
          </span>
        )}
      </div>
    </Link>
  );
}
