const V = 'v3';
const CACHE = 'ai-edu-' + V;
const FILES = ['./', './index.html', './manifest.json',
  './icons/icon-192x192.png', './icons/icon-512x512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request)
      .then(res => {
        if(res && res.status===200 && res.type!=='opaque'){
          const c = res.clone();
          caches.open(CACHE).then(cache=>cache.put(e.request,c));
        }
        return res;
      }).catch(()=>caches.match('./index.html'))
    )
  );
});
