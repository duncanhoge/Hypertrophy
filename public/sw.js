const CACHE_NAME = 'hypertrophy-hub-v1';
const STATIC_CACHE_NAME = 'hypertrophy-hub-static-v1';
const DYNAMIC_CACHE_NAME = 'hypertrophy-hub-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/manifest.json',
  // Add other critical assets
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^https:\/\/.*\.supabase\.co\/rest\/v1\//,
  /^https:\/\/.*\.supabase\.co\/auth\/v1\//,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((response) => {
              // Cache successful responses
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            })
            .catch(() => {
              // Return offline page if available
              return caches.match('/') || new Response('Offline', {
                status: 503,
                statusText: 'Service Unavailable'
              });
            });
        })
    );
    return;
  }

  // Handle API requests
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful GET requests
          if (request.method === 'GET' && response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Return cached version if available
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return a generic offline response for API calls
              return new Response(JSON.stringify({
                error: 'Offline',
                message: 'This feature requires an internet connection'
              }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              });
            });
        })
    );
    return;
  }

  // Handle static assets (CSS, JS, images, etc.)
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            // For images, return a placeholder or cached version
            if (request.destination === 'image') {
              return new Response('', {
                status: 503,
                statusText: 'Image not available offline'
              });
            }
            throw new Error('Resource not available offline');
          });
      })
  );
});

// Background sync for workout data
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'workout-sync') {
    event.waitUntil(syncWorkoutData());
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Time for your workout!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'start-workout',
        title: 'Start Workout',
        icon: '/icons/action-workout.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Hypertrophy Hub', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();
  
  if (event.action === 'start-workout') {
    event.waitUntil(
      clients.openWindow('/workout')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function to sync workout data
async function syncWorkoutData() {
  try {
    // Get pending workout data from IndexedDB or localStorage
    const pendingWorkouts = await getPendingWorkouts();
    
    if (pendingWorkouts.length > 0) {
      // Sync with Supabase
      for (const workout of pendingWorkouts) {
        await syncSingleWorkout(workout);
      }
      
      // Clear pending workouts after successful sync
      await clearPendingWorkouts();
      console.log('Service Worker: Workout data synced successfully');
    }
  } catch (error) {
    console.error('Service Worker: Error syncing workout data', error);
  }
}

// Placeholder functions for workout sync (to be implemented)
async function getPendingWorkouts() {
  // Implementation would retrieve pending workouts from IndexedDB
  return [];
}

async function syncSingleWorkout(workout) {
  // Implementation would sync individual workout to Supabase
  console.log('Syncing workout:', workout);
}

async function clearPendingWorkouts() {
  // Implementation would clear synced workouts from local storage
  console.log('Clearing pending workouts');
}