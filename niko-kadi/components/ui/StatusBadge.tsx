type Status = "verified" | "pending" | "unverified" | "flagged";

const statusConfig: Record<Status, { label: string; className: string }> = {
  verified: {
    label: "Verified",
    className: "bg-green-100 text-green-800",
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800",
  },
  unverified: {
    label: "Unverified",
    className: "bg-gray-100 text-gray-600",
  },
  flagged: {
    label: "Flagged",
    className: "bg-red-100 text-red-800",
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as Status] || statusConfig.unverified;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
