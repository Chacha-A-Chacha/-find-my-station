export const dynamic = "force-dynamic";

import HomeShell from "./HomeShell";

async function getConstituencies(searchParams: Record<string, string | undefined>) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const params = new URLSearchParams();
  if (searchParams.search) params.set("search", searchParams.search);
  if (searchParams.county) params.set("county", searchParams.county);
  if (searchParams.status) params.set("status", searchParams.status);
  if (searchParams.page) params.set("page", searchParams.page);

  try {
    const res = await fetch(`${baseUrl}/api/constituencies?${params.toString()}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { data: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
    return res.json();
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
