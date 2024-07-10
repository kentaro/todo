const CACHE_NAME = 'todo-app-v1';
const urlsToCache = [
  '/todo/',
  '/todo/index.html',
  '/todo/manifest.json',
  '/todo/icon-192x192.png',
  '/todo/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((error) => console.error('キャッシュの追加エラー:', error))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
      .catch((error) => console.error('フェッチエラー:', error))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/todo/icon-192x192.png',
    badge: '/todo/icon-192x192.png'
  };

  event.waitUntil(
    self.registration.showNotification('TODOの期限通知', options)
  );
});
