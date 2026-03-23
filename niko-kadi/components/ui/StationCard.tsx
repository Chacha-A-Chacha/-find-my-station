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
  status,
  has_coordinates,
}: StationCardProps) {
  const isVerified = status === "verified" && has_coordinates;

  return (
    <Link
      href={`/station/${slug}`}
      className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-emerald-100 hover:border-emerald-200 hover:shadow-sm transition-all active:scale-[0.98]"
    >
      {/* Pin icon */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
          isVerified ? "bg-emerald-100" : "bg-emerald-50"
        }`}
      >
        <svg
          className={`w-5 h-5 ${isVerified ? "text-emerald-600" : "text-emerald-400"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isVerified ? 2.5 : 2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isVerified ? 2.5 : 2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-slate-900 truncate">{name}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{county} County</p>
        {office_location && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{office_location}</p>
        )}
      </div>

      {/* Chevron */}
      <svg className="w-4 h-4 text-emerald-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
