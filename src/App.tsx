import { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
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
import { LoginPage } from "./pages/auth/LoginPage.tsx";
import { RegisterPage } from "./pages/auth/RegisterPage.tsx";
import { AboutPage } from "./pages/public/AboutPage.tsx";
import { ContactPage } from "./pages/public/ContactPage.tsx";
import { HomePage } from "./pages/public/HomePage.tsx";
import { ShopPage } from "./pages/public/ShopPage.tsx";
import { SellerOverviewPage } from "./pages/seller/SellerOverviewPage.tsx";
import { SellerProductsPage } from "./pages/seller/SellerProductsPage.tsx";
import { SellerReservationsPage } from "./pages/seller/SellerReservationsPage.tsx";

function ProtectedRoute({
  allowedRole,
  children,
}: {
  allowedRole: "admin" | "seller";
  children: ReactNode;
}) {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== allowedRole) {
    return (
      <Navigate
        to={currentUser.role === "admin" ? "/admin" : "/seller"}
        replace
      />
    );
  }

  return <>{children}</>;
}

function App() {
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
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <DashboardLayout role="admin" />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverviewPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="sellers" element={<AdminSellersPage />} />
          <Route path="reservations" element={<AdminReservationsPage />} />
          <Route path="history" element={<AdminReservationHistoryPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRole="seller">
              <DashboardLayout role="seller" />
            </ProtectedRoute>
          }
        >
          <Route index element={<SellerOverviewPage />} />
          <Route path="products" element={<SellerProductsPage />} />
          <Route path="reservations" element={<SellerReservationsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
