import { redirect } from "next/navigation";
import { verifySession } from "@/lib/admin/session";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  const session = await verifySession();
  if (session) redirect("/admin");

  return (
    <div className="min-h-full flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-green-700 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">findmystation</h1>
          <p className="text-sm text-gray-400 mt-1">Admin Dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
