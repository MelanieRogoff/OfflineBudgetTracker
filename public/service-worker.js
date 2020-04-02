const cacheName = 'v1';

const cacheAssets = [
    '/',
    'styles.css',
    '/dist/bundle.js',
    '/dist/icon_96x96.png',
    '/dist/icon_128x128.png',
    '/dist/icon_144x144.png',
    '/dist/icon_152x152.png',
    '/dist/icon_192x192x.png',
    '/dist/icon_384x384.png',
    'index.html',
    '/dist/manifest.json'
  ];

  //Call the Install event
  self.addEventListener("install", event  => {
    console.log("Service Worker Installed");

    event.waitUntil(
        caches
        .open(cacheName)
        .then(cache => {
            console.log("Service Worker: Caching Files");
            cache.addAll(cacheAssets);
        })
        .then(() => self.skipWaiting())
    )
  });
  
  //Call Activate Event
  self.addEventListener('activate', event => {
      console.log("Service Worker Activated");
      //Remove unwanted caches 
      event.waitUntil(
          caches.keys().then(cacheNames => {
              return Promise.all(
                  cacheNames.map(cache => {
                      if(cache !== cacheName) {
                          console.log('Service Worker: Clearing Old Cache');
                          return caches.delete(cache);
                      }
                  })
              )
          })
      )
  });

  //Call Fetch Event

  self.addEventListener('fetch', event => {
      console.log("Service Worker: Fetching");
      event.respondWith(
          fetch(event.request)//if no connection, this will fail
          .catch(() => caches.match(e.request))
      )
  })