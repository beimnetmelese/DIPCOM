import { Outlet } from "react-router-dom";
import { PublicFooter } from "./PublicFooter.tsx";
import { PublicNavbar } from "./PublicNavbar.tsx";

export function PublicLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <PublicNavbar />
      <main className="mx-auto w-full overflow-x-hidden px-3 pb-4 pt-20 sm:px-4 sm:pb-6 sm:pt-20 lg:px-6 lg:pb-8 lg:pt-20">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
