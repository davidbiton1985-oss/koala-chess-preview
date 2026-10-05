// GENERATED at build time (vite.config.ts) — do not edit by hand; edit the `serviceWorker` template there.
const VERSION = "koala-1791221976231";
const SHELL_CACHE = `koala-shell-${VERSION}`;
const MEDIA_CACHE = `koala-media-${VERSION}`;
const SHELL_URLS = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await Promise.allSettled(SHELL_URLS.map((u) => cache.add(u)));
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((k) => k !== SHELL_CACHE && k !== MEDIA_CACHE && (k.startsWith('koala-shell-') || k.startsWith('koala-media-')))
      .map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

// hashed JS/CSS, and the adventure/world/learn media a visit actually touches (json, mp4, webp, glb, fonts)
function isMedia(pathname) { return /\.(js|css|webp|png|jpg|jpeg|mp4|json|woff2|glb)$/.test(pathname); }

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // cross-origin (font CDNs etc.) stays network-only

  if (req.mode === 'navigate') {
    // network-first: an online visitor always gets the latest shell; offline falls back to what was cached
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        (await caches.open(SHELL_CACHE)).put(req, fresh.clone());
        return fresh;
      } catch {
        const cache = await caches.open(SHELL_CACHE);
        return (await cache.match(req)) ?? (await cache.match('./index.html')) ?? Response.error();
      }
    })());
    return;
  }

  // the rooms (panoramas + room.json) are re-rendered under the same names: network-first, so a new panorama never
  // pairs with an old camera (that drew the board in the wrong place); the cache is only the offline fallback.
  // Every .json too: the clip/voice indexes grow under the same name (a cached koala/index.json kept new Hebrew
  // lip-sync clips unplayed — he spoke with his mouth closed)
  if (url.pathname.includes('/env/') || url.pathname.endsWith('.json')) {
    event.respondWith((async () => {
      const cache = await caches.open(MEDIA_CACHE);
      try { const fresh = await fetch(req); if (fresh.ok && fresh.status === 200) cache.put(req, fresh.clone()); return fresh; }
      catch { return (await cache.match(req)) ?? Response.error(); }
    })());
    return;
  }
  if (isMedia(url.pathname)) {
    // stale-while-revalidate: instant from cache once visited, refreshed quietly in the background
    event.respondWith((async () => {
      const cache = await caches.open(MEDIA_CACHE);
      const cached = await cache.match(req);
      const network = fetch(req).then((res) => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => undefined);
      return cached ?? (await network) ?? Response.error();
    })());
  }
});
