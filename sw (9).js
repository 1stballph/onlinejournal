// My Diary Journal - Service Worker (shell only)
// Caches the PWA shell so it installs/launches; the live web app itself
// is always fetched from the network so your edits show immediately.
const CACHE_NAME = 'diary-journal-shell-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon.png'];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  var url = event.request.url;
  // Only serve the shell from cache. Everything else (the live Apps Script
  // app and its requests) goes straight to the network.
  if (url.indexOf(self.registration.scope) === 0) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
});
