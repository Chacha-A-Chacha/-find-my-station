import Link from "next/link";

interface StationCardProps {
  slug: string;
  name: string;
  county: string;
  county_slug: string;
  office_location?: string | null;
  status: string;
  confirmations: number;
  has_coordinates: boolean;
}

export default function StationCard({
  slug,
  name,
  county,
  office_location,
}: StationCardProps) {
  return (
    <Link
      href={`/station/${slug}`}
      className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all active:scale-[0.98]"
    >
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 truncate">{name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{county} County</p>
        {office_location && (
          <p className="text-xs text-gray-400 mt-1 truncate">{office_location}</p>
        )}
      </div>

      {/* Right: view details + chevron */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-xs text-green-700 font-medium hidden sm:inline">View details</span>
        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
