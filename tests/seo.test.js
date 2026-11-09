import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const load = file => readFile(root + file, 'utf8');
const pages = (await readdir(root)).filter(f => f.endsWith('.html'));
const sitemap = await load('sitemap.xml');

test('Cada página indexable tiene metadatos únicos, canonical y datos estructurados sin valoraciones no verificadas', async () => {
  const titles = new Set(); const descriptions = new Set();
  for (const file of pages) {
    const source = await load(file);
    assert.equal((source.match(/<h1\b/g) || []).length, 1, file + ': un solo h1');
    const title = source.match(/<title>(.*?)<\/title>/s)?.[1];
    const description = source.match(/<meta name="description" content="([^"]+)"/s)?.[1];
    assert.ok(title && description, file);
    assert.ok(!titles.has(title), file + ': título repetido'); titles.add(title);
    assert.ok(!descriptions.has(description), file + ': descripción repetida'); descriptions.add(description);
    const url = 'https://matematicasib.com/' + (file === 'index.html' ? '' : file.replace('.html', ''));
    assert.ok(source.includes(`rel="canonical" href="${url}"`), file);
    assert.ok(sitemap.includes(`<loc>${url}</loc>`), file + ': sitemap');
    const schema = JSON.parse(source.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.ok(schema['@graph'].some(v => v['@type'] === 'Person' && v.name === 'Gabriel Suárez'));
    assert.ok(!JSON.stringify(schema).includes('AggregateRating'));
    assert.ok(!source.includes('Testimonios Verificados'));
    for (const match of source.matchAll(/(?:href|src)=["'](\/[^"']*)["']/g)) {
      const target = new URL(match[1].replaceAll('&amp;', '&'), 'https://matematicasib.com');
      const targetFile = target.pathname === '/' ? 'index.html' : target.pathname.slice(1) + (/\.[a-z]+$/i.test(target.pathname) ? '' : '.html');
      const destination = await load(targetFile).catch(() => null);
      assert.notEqual(destination, null, `${file}: ${match[1]}`);
      if (target.hash) assert.match(destination, new RegExp(`id=["']${decodeURIComponent(target.hash.slice(1))}["']`), `${file}: ancla ${match[1]}`);
    }
  }
  assert.equal((sitemap.match(/<loc>/g) || []).length, pages.length);
});

test('Paquete de producción rastreable y vista de GitHub sin indexar', async () => {
  const robots = await load('dist/robots.txt');
  assert.match(robots, /User-agent: OAI-SearchBot\nAllow: \//);
  assert.match(robots, /Sitemap: https:\/\/matematicasib.com\/sitemap.xml/);
  assert.ok((await load('dist/_redirects')).includes('/matematicas-aa.html /matematicas-aa 301!'));
  assert.match(await load('dist/index.html'), /content="index, follow/);
  assert.match(await load('dist/index.html'), /\/css\/redesign\.css\?v=[a-f0-9]{12}/);
  assert.match(await load('docs/index.html'), /\/MATEMTICASIBCODEX\/js\/main\.js\?v=[a-f0-9]{12}/);
  assert.match(await load('docs/index.html'), /content="noindex, follow"/);
  assert.match(await load('docs/matematicas-aa.html'), /\/MATEMTICASIBCODEX\/herramientas-matematicas-ib.html/);
  assert.match(await load('docs/matematicas-aa.html'), /srcset="\/MATEMTICASIBCODEX\/img\/analisis-enfoques-ib-640\.webp 640w/);
});
