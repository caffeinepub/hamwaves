const CACHE_NAME = 'hamwaves-viewer-v1';
const VIEWER_URL = '/uv-k5-viewer';

const PRECACHE_ASSETS = [
  '/uv-k5-viewer',
  '/viewer-manifest.json',
  '/assets/generated/viewer-pwa-icon-192-transparent.dim_192x192.png',
  '/assets/generated/viewer-pwa-icon-512-transparent.dim_512x512.png',
  '/assets/generated/favicon-32x32-transparent.dim_32x32.png',
];

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UV-K5 Mirror – Offline</title>
  <meta name="theme-color" content="#00f0ff" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0a0a0a;
      color: #e0e0e0;
      font-family: Inter, system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      gap: 16px;
      padding: 24px;
      text-align: center;
    }
    .icon { font-size: 3rem; }
    h1 { color: #00f0ff; font-size: 1.5rem; font-weight: 800; }
    p { color: #888; font-size: 0.9rem; max-width: 340px; }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      border: 1px solid rgba(0,240,255,0.4);
      border-radius: 999px;
      color: #00f0ff;
      font-size: 0.8rem;
      font-weight: 600;
      background: rgba(0,240,255,0.06);
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="icon">📡</div>
  <h1>Offline</h1>
  <p>Connect radio when online. The viewer interface will load once you have a network connection.</p>
  <span class="badge">UV-K5 Mirror – Offline Mode</span>
</body>
</html>`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle viewer-scoped requests
  if (
    !url.pathname.startsWith('/uv-k5-viewer') &&
    !url.pathname.startsWith('/viewer-manifest') &&
    !url.pathname.includes('viewer-pwa-icon') &&
    !url.pathname.endsWith('.js') &&
    !url.pathname.endsWith('.css') &&
    !url.pathname.endsWith('.woff2')
  ) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html' } }))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
        }
        return response;
      }).catch(() => new Response('Offline', { status: 503 }));
    })
  );
});
