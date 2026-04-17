import { LogOut } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../context/AppContext.tsx";
import { DashboardSidebar } from "./DashboardSidebar.tsx";

interface DashboardLayoutProps {
  role: "admin" | "seller" | "staff";
}

export function DashboardLayout({ role }: DashboardLayoutProps) {
  const { currentUser, logout } = useAppContext();

  return (
    <div className="min-h-screen bg-white px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <div className="mx-auto grid w-full gap-4 lg:grid-cols-[240px,1fr]">
        <DashboardSidebar role={role} />
        <main className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {role} workspace
              </p>
              <h1 className="font-heading text-2xl font-bold text-slate-900">
                Hello {currentUser?.name}
              </h1>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl border border-orange-200 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
