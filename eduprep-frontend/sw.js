const CACHE = 'eduprep-ci-v2';
const OFFLINE_PAGE = '/app.html';

const PRECACHE = [
  '/index.html',
  '/app.html',
  '/manifest.json',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/assets/apple-touch-icon.png',
];

// Installation
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

// Activation — nettoyage anciens caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // API calls — Network only, fallback JSON si hors ligne
  if (url.hostname.includes('onrender.com') || url.hostname.includes('anthropic.com')) {
    e.respondWith(
      fetch(e.request).catch(() =>
        new Response(
          JSON.stringify({ error: 'Hors ligne — reconnectez-vous pour utiliser l\'IA.', code: 'OFFLINE' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      )
    );
    return;
  }

  // Fonts & CDN — Stale While Revalidate
  if (url.hostname.includes('googleapis') || url.hostname.includes('gstatic') || url.hostname.includes('jsdelivr')) {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          const network = fetch(e.request).then(r => { cache.put(e.request, r.clone()); return r; }).catch(() => null);
          return cached || network;
        })
      )
    );
    return;
  }

  // Assets locaux — Cache First, puis Network
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response.ok && e.request.method === 'GET') {
          caches.open(CACHE).then(c => c.put(e.request, response.clone()));
        }
        return response;
      }).catch(() => {
        if (e.request.destination === 'document') return caches.match(OFFLINE_PAGE);
      });
    })
  );
});

// Push notifications (préparé pour usage futur)
self.addEventListener('push', e => {
  const data = e.data?.json() || { title: 'EduPrep CI', body: 'Nouvelle notification' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/assets/icon-192.png',
      badge: '/assets/icon-192.png',
      tag: 'eduprep-notif',
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/app.html'));
});
