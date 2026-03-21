import { redirect } from "next/navigation";
import { verifySession } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma/client";
import { getActiveCount } from "@/lib/admin/heartbeat";
import StatCard from "@/components/admin/StatCard";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const session = await verifySession();
  if (!session) redirect("/admin/login");

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalConstituencies,
    verified,
    pending,
    flagged,
    totalContributions,
    todayContributions,
    totalContributors,
    totalFlags,
  ] = await Promise.all([
    prisma.constituency.count(),
    prisma.constituency.count({ where: { verificationStatus: "verified" } }),
    prisma.constituency.count({ where: { verificationStatus: "pending" } }),
    prisma.constituency.count({ where: { verificationStatus: "flagged" } }),
    prisma.contribution.count(),
    prisma.contribution.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.contributorIdentity.count(),
    prisma.flag.count(),
  ]);

  const unverified = totalConstituencies - verified - pending - flagged;
  const verifiedPct = totalConstituencies > 0 ? Math.round((verified / totalConstituencies) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400">Welcome back, {session.username}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {getActiveCount()} online
        </div>
      </div>

      {/* Verification progress */}
      <div className="bg-gray-800 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-300">Verification Progress</h2>
          <span className="text-2xl font-bold text-green-400">{verifiedPct}%</span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
          <div className="h-full flex">
            <div className="bg-green-500 transition-all" style={{ width: `${(verified / totalConstituencies) * 100}%` }} />
            <div className="bg-yellow-500 transition-all" style={{ width: `${(pending / totalConstituencies) * 100}%` }} />
            <div className="bg-red-500 transition-all" style={{ width: `${(flagged / totalConstituencies) * 100}%` }} />
          </div>
        </div>
        <div className="flex gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" />{verified} Verified</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" />{pending} Pending</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-600" />{unverified} Unverified</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />{flagged} Flagged</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Stations" value={totalConstituencies} color="gray" />
        <StatCard label="Contributions" value={totalContributions} sub={`${todayContributions} today`} color="blue" />
        <StatCard label="Contributors" value={totalContributors} color="green" />
        <StatCard label="Flags" value={totalFlags} color={totalFlags > 0 ? "red" : "gray"} />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { href: "/admin/live", label: "Live Users", desc: "See who's online", icon: "🟢" },
          { href: "/admin/stats", label: "County Stats", desc: "Breakdown by county", icon: "📊" },
          { href: "/admin/flags", label: "Review Flags", desc: `${totalFlags} pending`, icon: "🚩" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors group"
          >
            <span className="text-xl" aria-hidden="true">{link.icon}</span>
            <p className="text-sm font-semibold text-white mt-2 group-hover:text-green-400 transition-colors">{link.label}</p>
            <p className="text-xs text-gray-500">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
