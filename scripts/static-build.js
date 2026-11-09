import { mkdir, readFile, writeFile, cp, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('../', import.meta.url));
export async function buildStatic({ outDir, basePath = '', preview = false }) {
  const output = path.join(root, outDir);
  await mkdir(output, { recursive: true });
  const assetVersions = new Map();
  for (const folder of ['css', 'js']) {
    for (const file of await readdir(path.join(root, folder))) {
      if (!/\.(css|js)$/.test(file)) continue;
      const content = await readFile(path.join(root, folder, file));
      assetVersions.set(`/${folder}/${file}`, createHash('sha256').update(content).digest('hex').slice(0, 12));
    }
  }
  for (const name of await readdir(root)) {
    if (!name.endsWith('.html')) continue;
    let html = await readFile(path.join(root, name), 'utf8');
    html = html.replace(/\b(href|src)=(["'])(\/(?:css|js)\/[^"'?\s]+)(?:\?[^"']*)?\2/g, (match, attr, quote, url) => {
      const version = assetVersions.get(url);
      return version ? `${attr}=${quote}${url}?v=${version}${quote}` : match;
    });
    if (basePath) html = html.replace(/\b(href|src)=(['"])\/(?!\/)([^'"\s]*)\2/g, (_, attr, quote, target) => {
      const url = new URL('/' + target, 'https://build.invalid');
      let destination = url.pathname;
      if (destination === '/') destination = '/index.html';
      else if (!path.extname(destination)) destination = destination.replace(/\/$/, '') + '.html';
      return `${attr}=${quote}${basePath}${destination}${url.search}${url.hash}${quote}`;
    });
    if (basePath) html = html.replace(/\bsrcset=(["'])(.*?)\1/g, (_, quote, sources) => {
      const rewritten = sources.split(',').map(source => {
        const [url, ...descriptor] = source.trim().split(/\s+/);
        return [url.startsWith('/') && !url.startsWith('//') ? basePath + url : url, ...descriptor].join(' ');
      }).join(', ');
      return `srcset=${quote}${rewritten}${quote}`;
    });
    if (preview) html = html.replace('content="index, follow, max-image-preview:large"', 'content="noindex, follow"');
    await writeFile(path.join(output, name), html);
  }
  for (const folder of ['css', 'js', 'img']) await cp(path.join(root, folder), path.join(output, folder), { recursive: true });
  if (preview) {
    await writeFile(path.join(output, '.nojekyll'), '');
    await writeFile(path.join(output, 'robots.txt'), 'User-agent: *\nAllow: /\n');
  } else {
    for (const file of ['robots.txt', 'sitemap.xml', 'llms.txt', '_redirects', '_headers']) await cp(path.join(root, file), path.join(output, file));
  }
  console.log(`Site built in ${outDir}/ (${preview ? 'preview, noindex' : 'production'})`);
}
