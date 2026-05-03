import { Menu, UserCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext.tsx";
import { companyLogo, companyName } from "../utils/branding.ts";

const links = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function PublicNavbar() {
  const { currentUser, logout } = useAppContext();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardPath =
    currentUser?.role === "admin"
      ? "/admin"
      : currentUser?.role === "staff"
        ? "/staff/products"
        : currentUser?.sellerStatus === "pending"
          ? "/seller/pending"
          : "/seller";

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed left-0 top-0 z-40 w-full border-b border-orange-100 bg-white/90 backdrop-blur">
      <div className="flex w-full items-center justify-between gap-2 px-3 py-4 sm:px-4 lg:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-sm ring-1 ring-orange-100">
            <img
              src={companyLogo}
              alt={`${companyName} logo`}
              className="h-full w-full object-contain"
            />
          </span>
          <span className="max-w-[170px] truncate font-heading text-sm font-bold text-slate-900 sm:max-w-none sm:text-lg">
            {companyName}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${isActive ? "text-orange-600" : "text-slate-600 hover:text-slate-900"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {currentUser ? (
            <>
              <Link
                to={dashboardPath}
                className="rounded-xl border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-700"
              >
                Open Dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="hidden rounded-xl border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-700 sm:block"
              >
                Become Seller
              </Link>
              <Link
                to="/login"
                className="rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white"
              >
                <span className="inline-flex items-center gap-1">
                  <UserCircle2 className="h-4 w-4" /> Login
                </span>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-xl border border-orange-200 p-2 text-slate-700 md:hidden"
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-orange-100 bg-white px-3 pb-4 pt-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive ? "bg-orange-500 text-white" : "text-slate-700 hover:bg-orange-50"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-3 grid gap-2">
            {currentUser ? (
              <>
                <Link
                  to={dashboardPath}
                  className="rounded-xl border border-orange-200 px-3 py-2 text-center text-sm font-semibold text-orange-700"
                >
                  Open Dashboard
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="rounded-xl border border-orange-200 px-3 py-2 text-center text-sm font-semibold text-orange-700"
                >
                  Become Seller
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl bg-orange-500 px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  <span className="inline-flex items-center gap-1">
                    <UserCircle2 className="h-4 w-4" /> Login
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
