import test from 'node:test';
import assert from 'node:assert/strict';
import { server } from '../server.js';

test('El sitio sirve las páginas, los recursos SEO y rechaza rutas desconocidas', async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const route of ['/', '/matematicas-aa', '/matematicas-ai', '/clases-presenciales-quito', '/precios', '/sobre-mi', '/recursos', '/preguntas-frecuentes', '/contacto', '/clases-matematicas-ib-online', '/asesoria-exploracion-matematica-ia', '/aa-o-ai-matematicas-ib', '/privacidad']) {
      const response = await fetch(base + route);
      assert.equal(response.status, 200, route);
      const html = await response.text();
      assert.match(html, /Gabriel Suárez/);
      assert.match(html, /redesign\.css/);
      assert.match(html, /593998252624/);
    }
    for (const route of ['/css/redesign.css', '/js/main.js', '/img/casio-fx-cg50.png', '/robots.txt', '/sitemap.xml', '/llms.txt']) assert.equal((await fetch(base + route)).status, 200);
    for (const route of ['/no-existe', '/.git/config', '/package.json', '/server.js', '/scripts/build-pages.js']) assert.equal((await fetch(base + route)).status, 404);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
