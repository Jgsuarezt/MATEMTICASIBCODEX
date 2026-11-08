# Matemáticas IB — Gabriel Suárez

Rediseño adaptable a móvil y escritorio del sitio https://matematicasib.com/.
Se conservaron las nueve páginas principales, sus textos originales, precios, teléfono, imágenes, enlaces de WhatsApp, simulador gráfico Casio y calculadora de notas IB. La introducción original de la portada está disponible en el desplegable «Todo sobre las clases de Matemáticas IB».

## Ejecutar

Requiere Node.js 20 o posterior. No necesita instalar dependencias ni configurar claves.

```sh
cd /workspace/MATEMTICASIBCODEX
npm run dev
```

El servidor usa el puerto 3000. Se puede cambiar con `PORT=8080 npm start`.

```sh
npm test
```

## Estructura

- `index.html` y las otras ocho páginas HTML: contenido del sitio original y nueva portada.
- `css/styles.css`: estilos originales de componentes y herramientas.
- `css/redesign.css`: nuevo sistema visual, navegación y adaptación a móviles.
- `js/main.js`: herramientas interactivas originales.
- `js/accessibility.js`: estados accesibles de FAQ y cierre del menú.
- `img/`: imágenes recuperadas del sitio original.
- `server.js`: servidor local sin dependencias, con rutas HTML sin extensión.

En un alojamiento estático deben resolverse las rutas sin extensión a sus archivos `.html` correspondientes. No se ha publicado esta versión ni modificado el sitio en producción. Los testimonios y las estimaciones de notas proceden del contenido original; no se han verificado externamente.

## GitHub Pages

`npm run build` genera la carpeta `docs/` con rutas adaptadas a `/MATEMTICASIBCODEX/`.
La publicación utiliza la rama `main`, carpeta `/docs`. Tras modificar contenido o estilos, vuelve a ejecutar `npm run build` y sube también `docs/`.
