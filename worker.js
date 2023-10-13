
// Cambia a tu nombre del repositorio
var GHPATH = '/';

// Elije un prefijo diferente para tu nombre de aplicacion
var APP_PREFIX = 'GLV_EGG_';

// La version en cache. Cada vez que cambies los archivos
// necesitas cambiar esta version (version_01, version_02…). 
// Si no cambias la versión, el service worker le entregará
// los archivos viejos al usuario!
var VERSION = 'version_01f';

// Los archivos que serán entregados al usuario en offline. asegurate de 
// agregar otros a la lista
var URLS = [
    `${GHPATH}`,
    `${GHPATH}index.html`,
    `${GHPATH}worker.js`,
    `${GHPATH}style.css`,
    `${GHPATH}script.js`,
    `${GHPATH}GLV-sm.png`,
    `${GHPATH}GLV.png`
]

const cacheName = `${APP_PREFIX}${VERSION}`;
// List the files to precache
const precacheResources = URLS;

// Cuando service worker se instale, abre la cache y agrega el recurso precache a este
self.addEventListener('install', (event) => {
    console.log('-Evento install de Service worker-', URLS);
    event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
    console.log('-Evento activate de Service worker-');
});

// Cuando hay un pedido de extracción, intenta y responde con un recurso precargado, de otro modo vuelve por red
self.addEventListener('fetch', (event) => {
    console.log('Fetch interceptado para:', event.request.url);
    event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
            return cachedResponse;
        }
        return fetch(event.request);
    }),
            );
});
