// Cyberflix Systems — Service Worker Cleanup
// This file exists only to replace any stale cached service worker.
// It immediately skips waiting and claims all clients so the old SW is evicted.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.claim().then(() => {
      // Unregister self after activation — we don't need a SW
      return self.registration.unregister();
    })
  );
});
