import { Metadata } from "next";
import { notFound } from "next/navigation";
import StationShell from "./StationShell";

interface StationData {
  id: string;
  name: string;
  slug: string;
  county: { name: string; slug: string };
  office_location: string | null;
  landmark: string | null;
  distance_to_office: string | null;
  verification: {
    status: string;
    confirmed_lat: number | null;
    confirmed_lng: number | null;
    confirmation_count: number;
    verified_at: string | null;
  };
  contributions: Array<{
    id: string;
    lat: number;
    lng: number;
    contributor_name: string;
    identity_type: string;
    created_at: string;
  }>;
  navigation?: {
    google_maps: string;
    waze: string;
    apple_maps: string;
    uber: string;
    geo: string;
  };
}

async function getStation(slug: string): Promise<StationData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/station/${slug}`, {
      next: { revalidate: 30 },
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
  const station = await getStation(slug);
  if (!station) return { title: "Station Not Found" };

  const description = [
    `Find the IEBC voter registration office in ${station.name} constituency, ${station.county.name} County.`,
    station.office_location ? `Located at ${station.office_location}.` : "",
    station.landmark ? `Near ${station.landmark}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    title: `IEBC Office - ${station.name} Constituency`,
    description,
    openGraph: {
      title: `Find ${station.name} IEBC Office | findmystation`,
      description: `Navigate to the voter registration office in ${station.name} constituency.`,
    },
  };
}

export default async function StationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const station = await getStation(slug);
  if (!station) notFound();

  return (
    <>
      <StationShell station={station} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "GovernmentOffice",
            name: `IEBC Constituency Office - ${station.name}`,
            address: {
              "@type": "PostalAddress",
              addressLocality: station.county.name,
              addressCountry: "KE",
            },
            ...(station.verification.confirmed_lat && station.verification.confirmed_lng
              ? {
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: station.verification.confirmed_lat,
                    longitude: station.verification.confirmed_lng,
                  },
                }
              : {}),
            description: station.office_location || `IEBC office in ${station.name} constituency`,
          }),
        }}
      />
    </>
  );
}
