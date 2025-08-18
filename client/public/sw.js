/* const CACHE_NAME = 'convertscope-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  '/manifest.json'
];

const API_CACHE_NAME = 'convertscope-api-v1.0.0';
const API_ENDPOINTS = [
  '/api/exchange-rates',
  '/api/conversions/recent',
  '/api/favorites'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached');
        self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Error caching static assets:', error);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Service worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      handleApiRequest(event.request)
    );
    return;
  }
  
  // Handle static assets with cache-first strategy
  if (event.request.method === 'GET') {
    event.respondWith(
      handleStaticRequest(event.request)
    );
    return;
  }
});

// Network-first strategy for API requests
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for API request, trying cache:', url.pathname);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for exchange rates
    if (url.pathname === '/api/exchange-rates') {
      return new Response(JSON.stringify({
        base: 'USD',
        rates: {
          EUR: 0.85,
          GBP: 0.73,
          JPY: 110,
          CAD: 1.25,
          AUD: 1.35,
          CHF: 0.92,
          CNY: 6.45
        },
        timestamp: Date.now(),
        offline: true
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Return empty array for other API endpoints
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Cache-first strategy for static assets
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for static request:', request.url);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    
    throw error;
  }
}

// Background sync for saving data when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      doBackgroundSync()
    );
  }
});

async function doBackgroundSync() {
  try {
    // Sync any pending data when back online
    console.log('[SW] Background sync completed');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Push notification handling (for future use)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/manifest.json',
    badge: '/manifest.json',
    tag: 'convertscope-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Abrir ConvertScope'
      },
      {
        action: 'close',
        title: 'Cerrar'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'ConvertScope', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle periodic background sync (for currency rate updates)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'currency-rates-sync') {
    event.waitUntil(
      updateCurrencyRates()
    );
  }
});

async function updateCurrencyRates() {
  try {
    const response = await fetch('/api/exchange-rates');
    if (response.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put('/api/exchange-rates', response.clone());
      console.log('[SW] Currency rates updated in background');
    }
  } catch (error) {
    console.log('[SW] Failed to update currency rates in background:', error);
  }
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_NAME
    });
  }
});

console.log('[SW] ConvertScope Service Worker loaded');
 */

console.log('Service Worker disabled for API debugging');