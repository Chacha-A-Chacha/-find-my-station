import { redirect } from "next/navigation";
import { verifySession } from "@/lib/admin/session";
import Sidebar from "@/components/admin/Sidebar";

export const metadata = {
  title: { default: "Admin Dashboard", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if this is the login page by reading the URL from headers
  // Login page doesn't need auth
  const session = await verifySession();

  return (
    <div className="h-full bg-gray-950 text-gray-100">
      {session ? (
        <>
          <Sidebar />
          <main className="md:ml-56 min-h-full pt-12 md:pt-0">
            <div className="p-4 sm:p-6 lg:p-8">{children}</div>
          </main>
        </>
      ) : (
        // No sidebar for unauthenticated users (login page)
        <main className="min-h-full">{children}</main>
      )}
    </div>
  );
}
