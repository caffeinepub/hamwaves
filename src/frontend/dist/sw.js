const CACHE_NAME = 'hamwaves-uvk5-v1';
const OFFLINE_URL = '/equipment-reviews/uv-k5-live-mirror';

const PRECACHE_ASSETS = [
  '/equipment-reviews/uv-k5-live-mirror',
  '/manifest.json',
  '/assets/generated/pwa-icon-192.dim_192x192.png',
  '/assets/generated/pwa-icon-512-transparent.dim_512x512.png',
  '/assets/generated/favicon-32x32-transparent.dim_32x32.png',
  '/assets/generated/apple-touch-icon.dim_180x180.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => {
        // Silently ignore precache failures (some assets may not exist yet)
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-first for navigation (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() =>
          caches.match(OFFLINE_URL).then((cached) => {
            if (cached) return cached;
            // Offline fallback HTML
            return new Response(
              `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline – UV-K5 Viewer</title><style>body{background:#0a0a0a;color:#e0e0e0;font-family:Inter,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center;gap:1rem}h1{color:#00f0ff;font-size:1.8rem;text-shadow:0 0 20px #00f0ff}p{color:#aaa;max-width:400px}span{color:#00f0ff}</style></head><body><h1>📡 Offline Mode</h1><p>You're currently offline. <span>Connect your radio when back online</span> to use the live mirror.</p><p style="font-size:0.85rem">HamWaves UV-K5 / UV-K1 Viewer</p></body></html>`,
              { headers: { 'Content-Type': 'text/html' } }
            );
          })
        )
    );
    return;
  }

  // Cache-first for static assets
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.webp')
  ) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ||
          fetch(event.request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            return response;
          })
      )
    );
  }
});
