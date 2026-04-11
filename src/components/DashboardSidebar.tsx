import {
  Boxes,
  ChartNoAxesCombined,
  ClipboardList,
  Clock3,
  History,
  Settings,
  Store,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  role: "admin" | "seller";
}

export function DashboardSidebar({ role }: SidebarProps) {
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

  return (
    <aside className="h-full rounded-3xl border border-orange-100 bg-white p-3 shadow-soft">
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
  );
}
