# Progressive web App con React

## Tabla de contenido

- [¿Que es una PWA?](#que-es-una-pwa)

## ¿Que es una PWA?

No hay uns definición concreta sobre que es una PWA. Lo mejor es entender como es el panorama actual.

¿Cómo es una web hoy?

- **Spoiler Alert**: No funciona muy bien en mobile.

- Más del 50% de nuestros usuarios está en mobile.

- Tenemos malas conexiones en los dispositivos móviles, conexiones tipo 3G y LTE no son particularmente confiables. Esto genera que un sitio promedio tarda 14 segundos en cargar en mobile.

- La UX no es solamente el diseño de nuestra app, tiene que ver con que tan r'apido funciona nuestra aplicación en el mundo real, con un teledono que tiene una conexión mala.

Hay estudios que demuestran la importancia de lograr que tu sitio funcione rápidamente en dispositivos móviles:

- 50% de los usuarios se van de un sitio que tarda más de 3 segundos en cargar.
- Cada segundo de demora nos cuesta un 5-10% de nuestras ventas.

## Google Lighthouse

Es una herramienta oficial de Google que viene con Chrome, con la cual podemos hacer un diagnostico a una Web App. Estos diagnósticos se centran en Performance Y Accesibilidad, pero también tiene una hearramienta para diagnosticar si nuestra Web App se considera una PWA o no y que pasos debemos de tomar para que lo sea.

Lighthouse no sustituye hacer pruebas con un dispositico móvil real, siempre realiza pruebas en dispositivo móvil.

El diagnostico de Performance nos muestra dos de los conceptos más importantes en performance: First meaningful Paint y First interactive.

First meaningful Paint o Prime pintado significativo, esto señala cuanto tiempo tardo el navegador en renderizar la aplicación de una forma que tenga sentido. Generalmenete queremos que este situado entre 1 y 2 segundos.

First Interactive o primera interacción señala el tiempo cuando ya se cargó React, inicializo la aplicación y que podamos correr comandos dentro de la aplicación.

¿Cómo bajamos estos tiempos?

Para bajer el Time To First Maeningful Paint podemos hacer Server Side Rendering, reducir el tamanño de nuestro HTML y CSS o simplemente teniendo servidores más rápidos.

El Time To Interactive tiene mucho que ver con el framework que estemos utilizando, usualmente queremos que tarde menos de 5 segundos.

## Creando en Web Manifest

**_Nota IMPORTANTE_**

_Al momento de crear este curso esta saliendo Chrome 68, dicha versión va a cambiar el comportamiento del Add Homescreen sutilmene._

**create-react-app** nos da un **Web Manifest** pre-armado el cual debemos configurar. Todo lo que tiene que ver con nuestro **Web Manifest** está dentro de los archivos **index.html** y **manifest.json** de la carpeta public de nuestro proyecto.

### Manifest

El manifiesto de aplicaciones web proporciona información sobre una aplicación (como nombre, autor, icono y descripción) en un documento simplificado.

- **short_name**: Es el nombre que se utiliza en la Homescreen.
- **name**: Es el nombre de nuestra aplicación.
- **icons**: Especifica un array de imágenes que servirán como iconos de la aplicación. Cambiaremos el **_"favicon.ico"_** por **_"icon.png"_**, especificamos el tamaño a 512x512 y el tipo a **_image/png_**.
- **start_url**: Nos indica en que página comienza nuestra aplicación, por compativilidad siempre conviene que sea **/** en lugar de **/index.html**.
- **display**: Define el modo de visualización para la aplicación. Standalone significa que la aplicación puede correr por si misma.
- **theme_color**: Define qué color vamos a usar en la barra de tareas de Android para que combine con nuestra aplicación.
- **related_applications**: Sirve si queremos que Chrome en el Add to Homescreen recomiende una aplicación del Store.

Para probar nuestro **_Add to Homescreen_** debemos tener en cuenta que un reuisito fundamental de las PWA es que todo funcione con **_HTTPS_**.

Nuestra aplicación por defecto es fullscreen, asi que NO OLVIDES de brindar un camino al home.

En iOS nesecitamos añadir alguna metadata al **index.html** de nuestro proyecto.Al momento de probar nuestra aplicación en IOS nos daremos cuenta de que el Add to Homescreen en te caso debe ser añadido manualmente por el usuario.

```
<link rel='apple-touch-icon' href='/static/icon.png' />
<meta name='theme-color' content='orange' />
<meta name='apple-mobile-web-app-title' content='PlatziRecetas' />
<meta name='apple-mobile-web-app-capable' content='yes' />
<meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
```

## Service Worker

**_Los service workers solo funcionan en producción._**

Este información funciona con las versione

```
  "react-app-rewire-workbox": "2.0.1",
  "react-app-rewired": "1.5.2",
  "workbox-webpack-plugin": "3.3.1"
```

### ¿Qué es un Service Worker?

Son la característica más importante de una PWA.

Es lo que hace posible que las PWA funcionen, es un script que nuestro navegador corre detrás de escena y este no puede tocar el DOM.

Podemos tener control absoluto a nivel red de nuestra aplicación gracias a los service workers.

### create-react-app

**create-react-app** habrán leído que este incluye un service worker.

El service worker de Create React App hace algo llamado **“SW Precache“**, lo que hace es precargar y dejar disponibles offline todos los archivos necesarios para correr la aplicación. Una recomendación a la hora de hacer debugging es refrescar el sitio pues un service worker por lo general se inicializa después de la primera carga.

**_NUNCA conviene escribir nuestro propio service worker especialmente con herramientas de bajo nivel._**

## Workbox

[Workbox](https://developers.google.com/web/tools/workbox), una librería creada por Google para crear Service Workers.

Hay un pequeño detalle al momento de implementar **Workbox** en nuestro proyecto y es que estamos yendo en contra de los principios de **Create React App** y esto solo significa una cosa **“eject”**, esto nos llenaría de archivos que no nos sirven. Para evitar hacer eject vamos a instalar **react-app-rewired** y el plugin para **webpack** de **workbox**.

- **react-app-rewired**: esta libreria nos permite modificar el comportamiento de _create-react-app_ sin tener que hacer _“eject”_, esto nos permite sumar plugins com por ejemplo **react-app-rewire-workbox**.

- **react-app-rewire-workbox**: esta libreria nos permite remlazar el Service Worker que nos da por defecto create _create-react-app_ por **workbox**.

```
yarn add workbox-webpack-plugin react-app-rewire-workbox react-app-rewired
```

Cuendo hacemos un **rewired** de _create-react-app_ tenemos que crear un archivo que se llame **config-overrides.js** que nos va a permitir modificar la configuracion interna del proceso de **build**.

```
#config-overrides.js

const {defaultInjectConfig, rewireWorkboxInject} = require('react-app-rewire-workbox')
const path = require('path');

module.exports = function override(config, env) {
  if (env === "production") {
    console.log("Generating Service Worker")

    #genera la configuración
    const workboxConfig = {
      ...defaultInjectConfig,
      swSrc: path.join(__dirname, 'src', 'service-worker.js')
    }
    config = rewireWorkboxInject(workboxConfig)(config, env)
  }

  return config;
}
```

Configuración basica de **service-worker.js**

```
self.__precacheManifest = [].concat(self.__precacheManifest || []);

//Evitar Warnings
workbox.precaching.suppressWarnings();
/*precacheAndRoute este comando va a tomar nuestro __precacheManifest(los archivos js,css,index.html)
los archivos que sirven para correr nuestra app y los guardara detras de escena*/
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
```

Configuración de los scripts del **package.json**

```
"scripts": {
  "dev": "react-app-rewired start",
  "start": "serve ./build -s -p 5000",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test --env=jsdom",
  "eject": "react-scripts eject"
}
```

### Estrategias de Carga

El funcionamiento de un _service worker_ por defecto toma una lista de assets para precargarlos y si la ruta coincide exactamente con un asset entonces lo tomara de cache.

**Workbox** tiene una característica llamada **registerNavigationRoute** la cual se encarga de hacer el funcionamiento por defecto de un _service worker_ más aparte si encuentra una url que no conoce va a buscar una url, en este caso _index.html_ y que el se encargue de lo que va a mostrar.

Como queremos que cargue la aplicación:

- **Network Only**:
  Por defecto. Si hay conexión a internet, busca el recurso, si no hay pues dinosaurio de Chrome.

  **¿Cuándo usar Network Only?**
  Por defecto si no queremos cache o manejamos información en tiempo real.

- **Network First**:
  Es la forma _por defecto_ de manejar el modo Offline de una PWA, intenta con buscar en la red un recurso, en caso de no tener onexión lo busca en el caché.

  **¿Cuándo usar Network First?**
  Cuando queremos la última versión de un asset y tener soporte offline.

- **Cache First**:
  Es una estrategia de carga que lo primero que hace es ir al cache y si encuentra el recurso los sirve derectamente. En caso de que no encontrarlo va a ir a la red, guardar la información en cache y sirve esa versión.

  Esta estrategia puede ser peligrosa y solo es recomendable cuando queremos máxima velocidad y estamos manejando un recurso que nunca cambia, como la imagen o la fuente.

- **Stale While Revalidate**:
  Esta es una estrategia de carga muy particular y que mejor funciona a la hora de mejorar el rendimiento. Lo que hace es ir cache y a la red al mismo tiempo, toma la versión más rápida más rápida que siempre será la de cache y en cuanto recibe la de red va a actualizar la versión de cache.

  Es recomendable esta estrategia cuando queremos mucha velocidad y estamos manejando un recurso que puede estar levemente desactualizado.

_Al momento de escribir nuestra estrategias en Workbox SI IMPORTA el orden en que pongamos las cosas, siq ueremos una estrateia o regla por defecto debemos poner esa regla hasta el final de todo._

## Google Analytics Offline

Vamos a implementar Google Analytics con soporte offline en nuestra aplicación.

Como primer paso debemos incorporar **react-ga**, un plugin que nos permite correr Google Analytics dentro de React.

Para unir nuestro plugin a la historia de React Router la mejor opción es incorporarlo dentro de la historia de la aplicación cambiando el **BrowserRouter** po un router comun, creamos un nuevo history para poder extender los métodos del Router, y que cada vez que el usuario cambie de pagina haga tracking de una page view.

Si tienes algún adBlocker desactívalo cuando estés desarrollando tu sitio para evitar que bloqueé Google Analytics.

Workbox ya cuenta con un método para facilitar que Google Analytics funcione de forma offline, va a capturar todas las peticiones que hagamos a GA, las va a guardar en memoria y cunado el usuario retome la conexión a internet se enviaran las peticiones.
