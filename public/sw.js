const VERSION = '__GIT_REF__';
const CACHE_NAME = `todo-app-${VERSION}`;

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/?action=open_memo')) {
    event.respondWith(
      fetch('/').then(response => {
        return response;
      })
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('todo-app-') && cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
