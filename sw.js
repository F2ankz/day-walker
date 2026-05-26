// Day Walker — service worker
// Caches app shell + map tiles/style/fonts as they load

const SHELL_CACHE = 'dw-shell-v20';
const RUNTIME_CACHE = 'dw-runtime-v20';

const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(SHELL_CACHE).then(c => c.addAll(SHELL).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== SHELL_CACHE && k !== RUNTIME_CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Only cache http(s); skip chrome-extension://, blob:, data: etc.
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Network-first for HTML to pick up updates
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      fetch(req).then(resp => {
        const copy = resp.clone();
        caches.open(SHELL_CACHE).then(c => c.put(req, copy));
        return resp;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Cache-first for everything else (tiles, fonts, scripts, styles, images)
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(resp => {
        // Only cache opaque/ok responses to avoid storing errors
        if (resp && (resp.ok || resp.type === 'opaque')) {
          const copy = resp.clone();
          // Don't bloat — skip caching very large responses (>5MB)
          const lenHeader = resp.headers.get('content-length');
          if (!lenHeader || Number(lenHeader) < 5 * 1024 * 1024) {
            caches.open(RUNTIME_CACHE).then(c => c.put(req, copy));
          }
        }
        return resp;
      }).catch(() => cached);
    })
  );
});
