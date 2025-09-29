self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('readmeabc-v1').then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json',
        './read_me_icon_192.png',
        './read_me_icon_512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});