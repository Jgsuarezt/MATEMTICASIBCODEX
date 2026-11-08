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
