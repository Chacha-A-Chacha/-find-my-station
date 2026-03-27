export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma/client";
import HomeShell from "./HomeShell";

async function getConstituencies(searchParams: Record<string, string | undefined>) {
  const search = searchParams.search?.slice(0, 100) || null;
  const county = searchParams.county || null;
  const status = searchParams.status || null;
  const page = Math.max(1, parseInt(searchParams.page || "1"));
  const limit = 20;
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};

  if (county) where.county = { slug: county };
  if (status) where.verificationStatus = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { officeLocation: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [data, total] = await Promise.all([
      prisma.constituency.findMany({
        where,
        include: { county: { select: { name: true, slug: true } } },
        orderBy: { name: "asc" },
        skip,
        take: limit,
      }),
      prisma.constituency.count({ where }),
    ]);

    return {
      data: data.map((row) => ({
        slug: row.slug,
        name: row.name,
        county: row.county.name,
        county_slug: row.county.slug,
        office_location: row.officeLocation,
        status: row.verificationStatus,
        confirmations: row.confirmationCount,
        has_coordinates: !!(row.verifiedLat && row.verifiedLng),
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch {
    return { data: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const constituencies = await getConstituencies(resolvedParams);

  return (
    <HomeShell
      initialData={constituencies.data}
      initialPagination={constituencies.pagination}
      initialSearch={resolvedParams.search || ""}
      initialStatus={resolvedParams.status || ""}
    />
  );
}
