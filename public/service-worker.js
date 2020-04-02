const cacheName = 'v1';

  //Call the Install event
  self.addEventListener("install", event  => {
    console.log("Service Worker Installed");
  });
  
  //Call Activate Event
  self.addEventListener('activate', event => {
      console.log("Service Worker Activated");
      event.waitUntil( //Remove unwanted caches 
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
          fetch(
        event.request)
        .then(res => {
            const resClone = res.clone(); //Make copy/clone of response
            caches
                .open(cacheName)//Open cache
                .then(cache => {
                    cache.put(event.request, resClone);//Add response to cache
                });
                return res;
        })
        .catch(err => caches.match(event.request).then(res => res))
      )
  })