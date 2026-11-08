# Matemáticas IB — Gabriel Suárez

Sitio de clases particulares con enfoque en captación y SEO. Incluye trece páginas: servicios AA/AI, modalidades, precios, perfil, contacto, recursos, orientación para la IA, comparación AA/AI y privacidad. Conserva simulador y calculadora orientativa.

## Desarrollo

Node.js 20 o posterior. Sin dependencias ni claves.

```sh
cd /workspace/MATEMTICASIBCODEX
npm run dev
npm test
```

El servidor usa el puerto 3000 (`PORT` permite cambiarlo). `npm test` genera las versiones estáticas antes de comprobar páginas, enlaces, metadatos, sitemap y rutas.

## Netlify: versión de producción

```sh
npm run build:netlify
```

Publicar el **contenido de `dist/`**, con `index.html`, `_redirects`, `_headers`, `robots.txt`, `sitemap.xml`, `llms.txt`, CSS, JS e imágenes en la raíz. El ZIP entregado ya tiene esa estructura. Con despliegue desde Git, `netlify.toml` configura el build y publicación. Se incluyen redirecciones desde las URLs antiguas con `.html`. La redirección del dominio alternativo al principal se configura en Netlify/DNS.

Los canonical y sitemap señalan al dominio existente **https://matematicasib.com**. Antes de usar otro dominio definitivo, actualizar todas las referencias de identidad y verificar la redirección de hostname. Los deploy previews de Netlify usan `X-Robots-Tag: noindex`.

## GitHub Pages: vista previa

`npm run build` genera `docs/` con rutas para `/MATEMTICASIBCODEX/` y `noindex` para no competir con el dominio principal. Después de editar contenido, subir también la carpeta generada. GitHub Pages debe usar `main` y `/docs`.

## Contacto y medición

El formulario prepara mensajes para WhatsApp. No cobra, reserva ni envía mensajes automáticamente. No hay una base de datos de contactos ni una herramienta de analítica externa instalada. `js/growth.js` emite eventos locales sin nombres ni mensajes de alumnos y conserva UTM válidos durante la sesión. Consultar [el plan de captación](notes/PLAN-DE-CAPTACION.md) para conectar medición, verificar Search Console, trabajar el perfil local y distinguir clics de clientes.

Los testimonios del sitio anterior se archivaron fuera del paquete de publicación hasta verificar fuente y permiso. No se publican puntuaciones agregadas sin evidencia ni se garantizan notas o posicionamiento. La información de formación, experiencia y tarifas proviene del sitio original.

## Cloudflare Pages

Proyecto `matematicasib`, configurado en `wrangler.jsonc`. La cuenta se selecciona mediante `CLOUDFLARE_ACCOUNT_ID`. El contenido se puede actualizar mediante Direct Upload:

```sh
npm run build:cloudflare
CLOUDFLARE_ACCOUNT_ID=52791b99896aec1ee03f60bcb24a332d npx wrangler@4.158.0 pages deploy dist-cloudflare --project-name matematicasib --branch main
```

El token debe estar configurado de forma segura como `CLOUDFLARE_API_TOKEN`; nunca guardarlo en el repositorio. `dist-cloudflare/` incluye reglas de redirección compatibles con Pages: `www` y el subdominio estable de Pages apuntan al dominio principal `https://matematicasib.com`, conservando la ruta. Cloudflare Pages resuelve las URLs HTML sin extensión automáticamente.

La publicación en Pages es manual; subir commits a GitHub no despliega por sí solo este proyecto de Direct Upload. Para cambios futuros, compilar y desplegar otra vez. Se conservan las alternativas de Netlify y GitHub del repositorio.
