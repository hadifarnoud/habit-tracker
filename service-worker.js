const CACHE_NAME = 'habit-tracker-v1';
const urlsToCache = [
    'https://hadifarnoud.github.io/habit-tracker/',
    'https://hadifarnoud.github.io/habit-tracker/index.html',
    'https://hadifarnoud.github.io/habit-tracker/styles.css',
    'https://hadifarnoud.github.io/habit-tracker/app.js',
    'https://hadifarnoud.github.io/habit-tracker/icon-192x192.png',
    'https://hadifarnoud.github.io/habit-tracker/icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});