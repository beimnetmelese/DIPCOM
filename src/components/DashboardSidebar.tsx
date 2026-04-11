import {
  Boxes,
  ChartNoAxesCombined,
  ClipboardList,
  Clock3,
  Menu,
  History,
  Settings,
  Store,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface SidebarProps {
  role: "admin" | "seller";
}

export function DashboardSidebar({ role }: SidebarProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminLinks = [
    {
      to: "/admin",
      label: "Overview",
      icon: <ChartNoAxesCombined className="h-4 w-4" />,
    },
    {
      to: "/admin/products",
      label: "Products",
      icon: <Boxes className="h-4 w-4" />,
    },
    {
      to: "/admin/sellers",
      label: "Sellers",
      icon: <Users className="h-4 w-4" />,
    },
    {
      to: "/admin/reservations",
      label: "Reservations",
      icon: <ClipboardList className="h-4 w-4" />,
    },
    {
      to: "/admin/history",
      label: "History",
      icon: <History className="h-4 w-4" />,
    },
    {
      to: "/admin/settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  const sellerLinks = [
    {
      to: "/seller",
      label: "Dashboard",
      icon: <ChartNoAxesCombined className="h-4 w-4" />,
    },
    {
      to: "/seller/products",
      label: "Products",
      icon: <Store className="h-4 w-4" />,
    },
    {
      to: "/seller/reservations",
      label: "My Reservations",
      icon: <Clock3 className="h-4 w-4" />,
    },
  ];

  const links = role === "admin" ? adminLinks : sellerLinks;
  const activeLinkLabel = useMemo(
    () =>
      links.find((item) => {
        if (item.to === "/admin" || item.to === "/seller") {
          return location.pathname === item.to;
        }
        return location.pathname.startsWith(item.to);
      })?.label ?? "Navigation",
    [links, location.pathname],
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="rounded-3xl border border-orange-100 bg-white p-3 shadow-soft lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-xl border border-orange-200 px-3 py-2"
        >
          <span>
            <p className="text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {role} panel
            </p>
            <p className="mt-1 text-left text-sm font-semibold text-slate-900">
              {activeLinkLabel}
            </p>
          </span>
          {mobileOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>

        {mobileOpen ? (
          <nav className="mt-3 flex flex-col gap-1">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin" || item.to === "/seller"}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-slate-600 hover:bg-orange-50 hover:text-slate-900"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        ) : null}
      </div>

      <aside className="hidden h-full rounded-3xl border border-orange-100 bg-white p-3 shadow-soft lg:block">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {role} panel
        </p>
        <nav className="mt-2 flex flex-col gap-1">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin" || item.to === "/seller"}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-slate-600 hover:bg-orange-50 hover:text-slate-900"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
