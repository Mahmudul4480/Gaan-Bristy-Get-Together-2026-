// Minimal service worker — exists only so the site (and the Gate Scanner
// PWA) is reliably installable via "Add to Home Screen" on Android/Chrome.
// It intentionally caches nothing: guest cards, quiz state, and gate
// check-ins all come live from Firestore and must never be served stale.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // No-op: always let the request go to the network.
});
