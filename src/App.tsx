import { ReactNode, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout.tsx";
import { PublicLayout } from "./components/PublicLayout.tsx";
import { ToastContainer } from "./components/ToastContainer.tsx";
import { useAppContext } from "./context/AppContext.tsx";
import { AdminOverviewPage } from "./pages/admin/AdminOverviewPage.tsx";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage.tsx";
import { AdminReservationsPage } from "./pages/admin/AdminReservationsPage.tsx";
import { AdminReservationHistoryPage } from "./pages/admin/AdminReservationHistoryPage.tsx";
import { AdminSellersPage } from "./pages/admin/AdminSellersPage.tsx";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage.tsx";
import { AdminNotificationsPage } from "./pages/admin/AdminNotificationsPage.tsx";
import { LoginPage } from "./pages/auth/LoginPage.tsx";
import { RegisterPage } from "./pages/auth/RegisterPage.tsx";
import { SellerPendingPage } from "./pages/auth/SellerPendingPage.tsx";
import { AboutPage } from "./pages/public/AboutPage.tsx";
import { ContactPage } from "./pages/public/ContactPage.tsx";
import { HomePage } from "./pages/public/HomePage.tsx";
import { ShopPage } from "./pages/public/ShopPage.tsx";
import { SellerOverviewPage } from "./pages/seller/SellerOverviewPage.tsx";
import { SellerProductsPage } from "./pages/seller/SellerProductsPage.tsx";
import { SellerReservationsPage } from "./pages/seller/SellerReservationsPage.tsx";
import { SellerStockPage } from "./pages/seller/SellerStockPage.tsx";

function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: Array<"admin" | "seller" | "staff">;
  children: ReactNode;
}) {
  const { currentUser } = useAppContext();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (
    currentUser.role === "seller" &&
    currentUser.sellerStatus !== "approved" &&
    !location.pathname.startsWith("/seller/pending")
  ) {
    return <Navigate to="/seller/pending" replace />;
  }

  if (
    currentUser.role === "seller" &&
    currentUser.sellerStatus === "approved" &&
    location.pathname.startsWith("/seller/pending")
  ) {
    return <Navigate to="/seller" replace />;
  }

  if (
    currentUser.role === "seller" &&
    currentUser.sellerStatus !== "approved" &&
    location.pathname.startsWith("/seller") &&
    !location.pathname.startsWith("/seller/pending")
  ) {
    return <Navigate to="/seller/pending" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    const redirectPath =
      currentUser.role === "admin"
        ? "/admin"
        : currentUser.role === "staff"
          ? "/staff/products"
          : "/seller";

    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/seller/pending"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerPendingPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout role="admin" />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverviewPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="sellers" element={<AdminSellersPage />} />
          <Route path="reservations" element={<AdminReservationsPage />} />
          <Route path="history" element={<AdminReservationHistoryPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <DashboardLayout role="seller" />
            </ProtectedRoute>
          }
        >
          <Route index element={<SellerOverviewPage />} />
          <Route path="products" element={<SellerProductsPage />} />
          <Route path="reservations" element={<SellerReservationsPage />} />
          <Route path="stock" element={<SellerStockPage />} />
        </Route>

        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <DashboardLayout role="staff" />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="reservations" element={<AdminReservationsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
