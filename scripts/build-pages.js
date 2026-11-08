import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'docs');
const base = '/MATEMTICASIBCODEX';
await mkdir(output, { recursive: true });
for (const name of await readdir(root)) {
  if (!name.endsWith('.html')) continue;
  const html = (await readFile(path.join(root, name), 'utf8')).replace(/\b(href|src)=(['"])\/(?!\/)([^'"\s]*)\2/g, (_, attr, quote, target) => {
    const [page, ...hash] = target.split('#');
    let destination = page;
    if (!page) destination = 'index.html';
    else if (!path.extname(page)) destination += '.html';
    return `${attr}=${quote}${base}/${destination}${hash.length ? '#' + hash.join('#') : ''}${quote}`;
  });
  await writeFile(path.join(output, name), html);
}
for (const folder of ['css', 'js', 'img']) await cp(path.join(root, folder), path.join(output, folder), { recursive: true });
await writeFile(path.join(output, '.nojekyll'), '');
console.log('Sitio de GitHub Pages generado en docs/');
