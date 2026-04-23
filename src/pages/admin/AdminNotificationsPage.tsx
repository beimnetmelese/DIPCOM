import { Bell } from "lucide-react";
import { useAppContext } from "../../context/AppContext.tsx";

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export function AdminNotificationsPage() {
  const { notifications, markNotificationRead } = useAppContext();

  return (
    <section className="space-y-4">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Admin alerts
        </p>
        <h2 className="mt-1 font-heading text-2xl font-bold text-slate-900">
          Notifications
        </h2>
      </header>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const isUnread = !notification.isRead;
            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => void markNotificationRead(notification.id)}
                className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-orange-50 ${
                  isUnread ? "bg-orange-50/60" : "bg-white"
                }`}
              >
                <span
                  className={`mt-1.5 h-2.5 w-2.5 rounded-full ${
                    isUnread ? "bg-orange-500" : "bg-slate-300"
                  }`}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-slate-900">
                      {notification.title}
                    </span>
                    <span className="shrink-0 text-xs text-slate-400">
                      {formatDate(notification.createdAt)}
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
          <div className="px-4 py-10 text-center text-sm text-slate-500">
            <Bell className="mx-auto mb-2 h-5 w-5" />
            No notifications yet.
          </div>
        )}
      </div>
    </section>
  );
}
