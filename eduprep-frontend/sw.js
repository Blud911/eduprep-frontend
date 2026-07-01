// ============================================================
// EduPrep CI — Service Worker v3
// Strategie : Network First pour HTML, Cache First pour assets
// Mise a jour automatique + bandeau iOS
// ============================================================

const CACHE_VERSION = 'eduprep-ci-v3';
const OFFLINE_PAGE  = '/app.html';

const PRECACHE_ASSETS = [
  '/app.html',
  '/index.html',
  '/manifest.json',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/assets/apple-touch-icon.png',
];

// ============================================================
// INSTALL — precache des assets essentiels
// ============================================================
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()) // Active immediatement la nouvelle version
      .catch(() => self.skipWaiting())
  );
});

// ============================================================
// ACTIVATE — supprime les anciens caches + prend le controle
// ============================================================
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k !== CACHE_VERSION)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim()) // Prend le controle de tous les onglets ouverts
      .then(() => {
        // Notifie les clients qu'une mise a jour est disponible
        return self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
        });
      })
  );
});

// ============================================================
// FETCH — strategies differentes selon le type de ressource
// ============================================================
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // 1. API backend — Network Only avec fallback JSON offline
  if (url.hostname.includes('onrender.com') || url.hostname.includes('anthropic.com')) {
    e.respondWith(
      fetch(e.request).catch(() =>
        new Response(
          JSON.stringify({
            error: 'Hors ligne — reconnectez-vous pour utiliser l\'IA.',
            code: 'OFFLINE'
          }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      )
    );
    return;
  }

  // 2. Fonts & CDN externes — Stale While Revalidate
  if (
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('jsdelivr.net')
  ) {
    e.respondWith(
      caches.open(CACHE_VERSION).then(cache =>
        cache.match(e.request).then(cached => {
          const networkFetch = fetch(e.request)
            .then(response => {
              cache.put(e.request, response.clone());
              return response;
            })
            .catch(() => cached);
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  // 3. Pages HTML — Network First (garantit les mises a jour)
  if (e.request.destination === 'document' || e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          // Met a jour le cache avec la nouvelle version
          if (response.ok) {
            caches.open(CACHE_VERSION).then(cache => cache.put(e.request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Offline : sert la page depuis le cache
          return caches.match(e.request) || caches.match(OFFLINE_PAGE);
        })
    );
    return;
  }

  // 4. Assets locaux (images, JSON) — Cache First puis Network
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response.ok && e.request.method === 'GET') {
          caches.open(CACHE_VERSION).then(c => c.put(e.request, response.clone()));
        }
        return response;
      }).catch(() => {
        if (e.request.destination === 'document') return caches.match(OFFLINE_PAGE);
      });
    })
  );
});

// ============================================================
// MESSAGE — commandes depuis l'app
// ============================================================
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (e.data?.type === 'GET_VERSION') {
    e.ports[0]?.postMessage({ version: CACHE_VERSION });
  }
});

// ============================================================
// PUSH NOTIFICATIONS
// ============================================================
self.addEventListener('push', e => {
  const data = e.data?.json() || { title: 'EduPrep CI', body: 'Nouvelle notification' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/assets/icon-192.png',
      badge: '/assets/icon-192.png',
      tag: 'eduprep-notif',
      requireInteraction: false,
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/app.html'));
});