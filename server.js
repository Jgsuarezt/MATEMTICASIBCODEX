import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' };
export const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let path = decodeURIComponent(url.pathname);
    if (path === '/') path = '/index.html';
    else if (!extname(path)) path = path.replace(/\/$/, '') + '.html';
    const file = resolve(root, '.' + path);
    if (!file.startsWith(root.endsWith(sep) ? root : root + sep)) {
      res.writeHead(403); res.end('Acceso no permitido'); return;
    }
    const allowed = /\.(html|css|js|png|svg|ico|webp|jpg|jpeg)$/i.test(file) && !path.split('/').some(p => p.startsWith('.'));
    if (!allowed) { res.writeHead(404); res.end('Página no encontrada'); return; }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    res.end(data);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Página no encontrada'); }
});
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  server.listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('Matemáticas IB: servidor iniciado en puerto ' + (process.env.PORT || 3000)));
}
