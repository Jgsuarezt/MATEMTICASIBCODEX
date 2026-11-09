import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
test('Los enlaces de contacto usan el teléfono correcto y funcionan sin ventanas emergentes', async () => {
  let checked = 0;
  for (const file of (await readdir(root)).filter(name => name.endsWith('.html'))) {
    const html = await readFile(root + file, 'utf8');
    for (const [tag] of html.matchAll(/<a\b[^>]*>/g)) {
      const href = tag.match(/\bhref=(["'])(.*?)\1/)?.[2]?.replaceAll('&amp;', '&');
      const dynamic = /\bid="(?:quick-fallback|booking-fallback|calc-whatsapp-cta)"/.test(tag);
      if (!href?.startsWith('https://wa.me/') && !dynamic) continue;
      const target = tag.match(/\btarget=(["'])(.*?)\1/)?.[2] || '_self';
      assert.equal(target, '_self', file + ': contacto sin popup');
      if (href?.startsWith('https://wa.me/')) {
        const url = new URL(href);
        assert.equal(url.pathname, '/593998252624', file + ': teléfono');
        assert.equal(url.search, '', file + ': enlace directo idéntico al comprobado por el propietario');
        assert.ok(!url.searchParams.has('amp;text'), file + ': parámetros HTML');
      }
      checked++;
    }
  }
  assert.ok(checked >= 20, 'Se revisaron los accesos de contacto de todo el sitio');
});
