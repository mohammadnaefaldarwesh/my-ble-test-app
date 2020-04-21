/* eslint-disable no-unused-vars */
const cacheName = 'fit20-v2';
const staticAssets = [
  // '/',
  // '/js/app.js',
  // './index.html',
  // '/js/chunk-vendors.js',
  // '/css/app.ee3483d6.css',
  // '/js/app.eddba49b.js',
  // './fit20-logo+graypng',
  // '/js/chunk-vendors.2626f484.js',
  // '/img/bgpattern.5ebd0070.jpg',
  // '/manifest.webmanifest',
  // '/favicon.ico',
  // '/fit20-icon.png',
  // '/api/translate',
  // '/img/fit20-logo.de0acec8.png',
  // '/img/arrow.2c172d4f.png',
  // '/img/fit20-logo-white.55171086.png',
  // 'https://db.onlinewebfonts.com/t/50caebd3d1f303be2ec212f78f8c084e.woff2',
  // './index.js',
];

self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches
      .keys()
      .then(keyList =>
        Promise.all(keyList.filter(key => key !== cacheName).map(key => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}
