const CACHE_NAME = "mcpm-v2";
const STATIC_ASSETS = [
  "/",
  "/plataforma",
  "/login",
  "/manifest.json",
];

const API_CACHE = "mcpm-api-v1";

// Install - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== API_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch - network first for APIs, cache first for static
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    // For POST requests (offline sessions), queue them
    if (request.url.includes("/api/sessions") && request.method === "POST") {
      event.respondWith(handleOfflinePost(request));
    }
    return;
  }

  // API routes: network first, cache fallback
  if (request.url.includes("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(API_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets: cache first, network fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      });
    })
  );
});

// Handle offline POST requests
async function handleOfflinePost(request) {
  try {
    const response = await fetch(request.clone());
    return response;
  } catch {
    const body = await request.json();
    await storeOfflineData(body);
    return new Response(JSON.stringify({ offline: true, queued: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// IndexedDB for offline queue
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("mcpm-offline", 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("queue")) {
        db.createObjectStore("queue", { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function storeOfflineData(data) {
  const db = await openDB();
  const tx = db.transaction("queue", "readwrite");
  tx.objectStore("queue").add({ data, timestamp: Date.now() });
}

// Background sync
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-sessions") {
    event.waitUntil(replayOfflineQueue());
  }
});

async function replayOfflineQueue() {
  const db = await openDB();
  const tx = db.transaction("queue", "readonly");
  const store = tx.objectStore("queue");
  const allItems = await new Promise((resolve) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
  });

  for (const item of allItems) {
    try {
      await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.data),
      });
      const deleteTx = db.transaction("queue", "readwrite");
      deleteTx.objectStore("queue").delete(item.id);
    } catch {
      break;
    }
  }
}

// Push notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || "MCPM Academy", {
      body: data.body || "Voce tem uma nova notificacao!",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: data.tag || "mcpm-notification",
      data: { url: data.url || "/plataforma" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || "/plataforma")
  );
});
