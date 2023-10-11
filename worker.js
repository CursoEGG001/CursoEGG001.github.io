
// Cambia a tu nombre del repositorio
var GHPATH = '/';

// Elije un prefijo diferente para tu nombre de aplicacion
var APP_PREFIX = 'GLV_EGG_';

// La version en cache. Cada vez que cambies los archivos
// necesitas cambiar esta version (version_01, version_02…). 
// Si no cambias la versión, el service worker le entregará
// los archivos viejos al usuario!
var VERSION = 'version_00';

// Los archivos que serán entregados al usuario en offline. asegurate de 
// agregar otros a la lista
var URLS = [    
  `${GHPATH}/`,
  `${GHPATH}/GenPrecio.html`,
  `${GHPATH}/styles.css`,
  `${GHPATH}/script.js`
]