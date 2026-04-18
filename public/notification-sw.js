self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.json() : {};
  const title = payload.title || "Notification";
  const targetPath =
    payload.metadata && payload.metadata.targetPath
      ? payload.metadata.targetPath
      : "/";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.message || "You have a new update.",
      icon: "/vite.svg",
      badge: "/vite.svg",
      data: {
        targetPath,
      },
    }),
  );
});

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetPath =
    event.notification.data && event.notification.data.targetPath
      ? event.notification.data.targetPath
      : "/";
  const targetUrl = new URL(targetPath, self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }

        return undefined;
      }),
  );
});
