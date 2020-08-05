self.__precacheManifest = [].concat(self.__precacheManifest || []);

//Evitar Warnings
// workbox.precaching.suppressWarnings();
/*precacheAndRoute este comando va a tomar nuestro __precacheManifest(los archivos js,css,index.html)
los archivos que sirven para correr nuestra app y los guardara detras de escena*/
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute("/index.html");

//GA
workbox.googleAnalytics.initialize();

/*Lo que hace registerRoute es que si tenemos algo ya cacheado en el service worker que tiene algun tipo de comportamiento lo va a
respetar, pero si encontramos una url que no conocemos no va a fallar la conexión en paginas internas*/
console.log(workbox);
workbox.routing.registerRoute(
  new RegExp(/^https?:\/\/www.themealdb.com\/api\/.*/),
  new workbox.strategies.StaleWhileRevalidate(),
  "GET"
);

workbox.routing.registerRoute(
  new RegExp(/^https:\/\/fonts.(?:googleapis|gstatic).com\/(.*)/),
  new workbox.strategies.CacheFirst({
    cacheName: "google-fonts-cache",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20,
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  }),
  "GET"
);

//Por defecto. va al final de todo.
workbox.routing.registerRoute(
  new RegExp(/^https?.*/),
  new workbox.strategies.NetworkFirst(),
  "GET"
);
