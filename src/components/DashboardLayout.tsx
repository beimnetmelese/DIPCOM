import { Bell, LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.tsx";
import { DashboardSidebar } from "./DashboardSidebar.tsx";

interface DashboardLayoutProps {
  role: "admin" | "seller" | "staff";
}

export function DashboardLayout({ role }: DashboardLayoutProps) {
  const {
    currentUser,
    notifications,
    markNotificationRead,
    logout,
    unreadNotificationCount,
    enableBrowserNotifications,
  } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationSupported =
    typeof window !== "undefined" && "Notification" in window;
  const notificationPermission = notificationSupported
    ? Notification.permission
    : "denied";

  const visibleNotifications = useMemo(
    () => notifications.slice(0, 8),
    [notifications],
  );

  const resolveNotificationTarget = (
    notification: (typeof notifications)[number],
  ) => {
    const metadata = notification.metadata ?? {};
    const explicitTarget = metadata.targetPath;
    if (typeof explicitTarget === "string" && explicitTarget) {
      return explicitTarget;
    }

    if (notification.kind.startsWith("stock_")) {
      return role === "seller" ? "/seller/stock" : "/admin/products";
    }

    if (notification.kind.startsWith("reservation_")) {
      return role === "seller" ? "/seller/reservations" : "/admin/reservations";
    }

    return role === "seller" ? "/seller" : "/admin";
  };

  const handleNotificationClick = async (
    notification: (typeof notifications)[number],
  ) => {
    await markNotificationRead(notification.id);
    setNotificationsOpen(false);
    navigate(resolveNotificationTarget(notification));
  };

  useEffect(() => {
    setNotificationsOpen(false);
  }, [location.pathname]);

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
            <div className="relative flex flex-wrap items-center gap-2">
              {notificationPermission !== "granted" && (
                <button
                  type="button"
                  onClick={() => void enableBrowserNotifications()}
                  className="inline-flex items-center gap-2 rounded-xl border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-700"
                >
                  <Bell className="h-4 w-4" />
                  Enable alerts
                </button>
              )}
              <button
                type="button"
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700"
              >
                <Bell className="h-4 w-4" />
                Notifications{" "}
                {unreadNotificationCount ? `(${unreadNotificationCount})` : ""}
              </button>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl border border-orange-200 px-3 py-2 text-sm font-semibold text-slate-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>

              {notificationsOpen ? (
                <div className="absolute right-0 top-full z-30 mt-2 w-[min(92vw,28rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Notifications
                      </p>
                      <p className="text-xs text-slate-500">
                        {unreadNotificationCount} unread, {notifications.length}{" "}
                        total
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(false)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                    >
                      Close
                    </button>
                  </div>

                  <div className="max-h-[28rem] overflow-y-auto">
                    {visibleNotifications.length > 0 ? (
                      visibleNotifications.map((notification) => {
                        const isUnread = !notification.isRead;
                        return (
                          <button
                            key={notification.id}
                            type="button"
                            onClick={() =>
                              void handleNotificationClick(notification)
                            }
                            className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-orange-50 ${
                              isUnread ? "bg-orange-50/60" : "bg-white"
                            }`}
                          >
                            <span
                              className={`mt-1 h-2.5 w-2.5 rounded-full ${
                                isUnread ? "bg-orange-500" : "bg-slate-300"
                              }`}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center justify-between gap-3">
                                <span className="truncate text-sm font-semibold text-slate-900">
                                  {notification.title}
                                </span>
                                <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                  {notification.kind.replace(/_/g, " ")}
                                </span>
                              </span>
                              <span className="mt-1 block text-sm leading-6 text-slate-600">
                                {notification.message}
                              </span>
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-4 py-8 text-center text-sm text-slate-500">
                        No notifications yet.
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
