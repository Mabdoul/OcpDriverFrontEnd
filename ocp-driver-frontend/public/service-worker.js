// Basic PWA service worker placeholder.
// Replace cache strategy with your own implementation when backend/API is ready.

self.addEventListener('install', (event) => {
  // eslint-disable-next-line no-console
  console.log('[Service Worker] Install event')
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  // eslint-disable-next-line no-console
  console.log('[Service Worker] Activate event')
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', () => {
  // Placeholder: currently just lets network requests pass through.
})


