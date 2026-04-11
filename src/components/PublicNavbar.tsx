import { PackageCheck, UserCircle2 } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext.tsx";

const links = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function PublicNavbar() {
  const { currentUser, logout } = useAppContext();

  return (
    <header className="fixed left-0 top-0 z-40 w-full border-b border-orange-100 bg-white/90 backdrop-blur">
      <div className="flex w-full items-center justify-between px-3 py-4 sm:px-4 lg:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="rounded-xl bg-orange-500 p-2 text-white">
            <PackageCheck className="h-5 w-5" />
          </span>
          <span className="font-heading text-lg font-bold text-slate-900">
            DIPCOM Technologies
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

        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <Link
                to={currentUser.role === "admin" ? "/admin" : "/seller"}
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
      </div>
    </header>
  );
}
