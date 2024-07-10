self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('todo-app-v1').then((cache) => {
      return cache.addAll([
        '/todo',
        '/todo/index.html',
        '/todo/_next/static/chunks/main.js',
        // その他の必要なアセットを追加
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
