
// Cambia a tu nombre del repositorio
var GHPATH = '/';

// Elije un prefijo diferente para tu nombre de aplicacion
var APP_PREFIX = 'GLV_EGG_';

// La version en cache. Cada vez que cambies los archivos
// necesitas cambiar esta version (version_01, version_02…). 
// Si no cambias la versión, el service worker le entregará
// los archivos viejos al usuario!
var VERSION = 'version_02fc';

// Los archivos que serán entregados al usuario en offline. asegurate de 
// agregar otros a la lista
var URLS = [
    `${GHPATH}`,
    `${GHPATH}index.html`,
    `${GHPATH}worker.js`,
    `${GHPATH}style.css`,
    `${GHPATH}script.js`,
    `${GHPATH}GLV-sm.png`,
    `${GHPATH}maskable_GLV.png`,
    `${GHPATH}GLV.png`
]

const cacheName = `${APP_PREFIX}${VERSION}`;
// Lista los archivos a la precache
const precacheResources = URLS;

const addResourcesToCache = async (resources) => {
    const cache = await caches.open(cacheName);
    await cache.addAll(resources);
};

const putInCache = async (request, response) => {
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
    // Primero trata de conseguir el recurso de la cache.
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }

    // Después intenta usar respuesta precargada.
    const preloadResponse = await preloadResponsePromise;
    if (preloadResponse) {
        console.info('usando respuesta precargda', preloadResponse);
        putInCache(request, preloadResponse.clone());
        return preloadResponse;
    }

    // Después trata de conseguir el recurso desde red.
    try {
        const responseFromNetwork = await fetch(request.clone());
        //  La respuesta puede ser usada solo una vez
        //  necesitamos guardar un clon para poner una copia en cache
        // y entregar la segunda.
        putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch (error) {
        const fallbackResponse = await caches.match(fallbackUrl);
        if (fallbackResponse) {
            return fallbackResponse;
        }
        // when even the fallback response is not available,
        // there is nothing we can do, but we must always
        // return a Response object
        return new Response('Sucedió un error de red', {
            status: 408,
            headers: {'Content-Type': 'text/plain'},
        });
}
};

const enableNavigationPreload = async () => {
    if (self.registration.navigationPreload) {
        // Habilita precargar navegación.
        await self.registration.navigationPreload.enable();
    }
};

// Cuando service worker se instale, abre la cache y agrega el recurso precache a este
self.addEventListener('install', (event) => {
    event.waitUntil(
            addResourcesToCache(precacheResources)
            );
});


self.addEventListener('activate', (event) => {
    console.log('-Evento activate de Service worker-');
    event.waitUntil(enableNavigationPreload());
});

// Cuando hay un pedido de extracción, intenta y responde con un recurso precargado, de otro modo vuelve por red

self.addEventListener('fetch', (event) => {
    console.log('Fetch interceptado para:', event.request.url);
    event.respondWith(
            cacheFirst({
                request: event.request,
                preloadResponsePromise: event.preloadResponse,
                fallbackUrl: './index.html',
            })
            );
});

