// Bump this version whenever index.html changes to force phones to refresh.
const CACHE_NAME = 'tshara-training-v2';
const CORE = ['./', './index.html'];
const OPTIONAL = [
  'https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=Space+Mono:wght@400;700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE_NAME);
    // Core assets must cache or the app can't run offline.
    await c.addAll(CORE);
    // Fonts are best-effort: never let them break the install.
    await Promise.all(OPTIONAL.map(u => c.add(u).catch(() => {})));
  })());
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
