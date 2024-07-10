self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('todo-app-v1').then((cache) => {
      return cache.addAll([
        '/todo/',
        '/todo/index.html',
        '/todo/_next/static/chunks/main.js',
        '/todo/_next/static/chunks/pages/_app.js',
        '/todo/_next/static/chunks/pages/index.js',
        '/todo/_next/static/css/main.css',
        '/todo/manifest.json',
        '/todo/icon-192x192.png',
        '/todo/icon-512x512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('todo-app-') && cacheName !== 'todo-app-v1';
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
