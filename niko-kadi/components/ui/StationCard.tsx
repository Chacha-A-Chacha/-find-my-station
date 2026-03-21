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
        <StatusBadge status={status} />
      </div>
      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
        {has_coordinates && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            GPS Available
          </span>
        )}
        <span>{confirmations} confirmation{confirmations !== 1 ? "s" : ""}</span>
      </div>
    </Link>
  );
}
