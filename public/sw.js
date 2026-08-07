const CACHE_NAME = "nova-market-v1";
const OFFLINE_URL = "/offline.html";
const SHELL_URLS = [
  "/",
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-256.png",
  "/icons/icon-384.png",
  "/icons/icon-512.png",
  "/icons/icon-512-maskable.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function pathKey(request) {
  const url = new URL(request.url);
  return new Request(`${url.pathname}${url.search}`, { method: "GET" });
}

async function networkFirst(request, key) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(key, response.clone());
    }
    return response;
  } catch {
    return (await caches.match(key)) || caches.match(OFFLINE_URL);
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const key = pathKey(request);
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, key));
    return;
  }

  if (["script", "style", "image", "font"].includes(request.destination)) {
    event.respondWith(
      caches.match(key).then((cached) => cached || fetch(request).then(async (response) => {
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(key, response.clone());
        }
        return response;
      }).catch(() => caches.match(OFFLINE_URL))),
    );
  }
});
