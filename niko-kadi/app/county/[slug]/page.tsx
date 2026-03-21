export const dynamic = "force-dynamic";

import { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import StationCard from "@/components/ui/StationCard";

interface ConstituencyItem {
  slug: string;
  name: string;
  county: string;
  county_slug: string;
  status: string;
  confirmations: number;
  has_coordinates: boolean;
}

async function getCountyConstituencies(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/constituencies?county=${slug}&limit=50`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const countyName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `IEBC Offices in ${countyName} County`,
    description: `Find all IEBC voter registration offices in ${countyName} County, Kenya.`,
  };
}

export default async function CountyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getCountyConstituencies(slug);

  const countyName =
    result?.data?.[0]?.county ||
    slug
      .split("-")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const constituencies: ConstituencyItem[] = result?.data || [];
  const verified = constituencies.filter((c) => c.status === "verified").length;

  return (
    <PageShell title={`${countyName} County`}>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">{countyName} County</h1>
        <p className="text-xs text-gray-500 mt-1">
          {constituencies.length} constituencies &middot; {verified} verified
        </p>
      </div>

      <div className="space-y-2">
        {constituencies.length === 0 ? (
          <p className="text-center py-8 text-sm text-gray-500">
            No constituencies found for this county.
          </p>
        ) : (
          constituencies.map((station) => (
            <StationCard key={station.slug} {...station} />
          ))
        )}
      </div>
    </PageShell>
  );
}
