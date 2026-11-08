import { buildStatic } from './static-build.js';
import { writeFile } from 'node:fs/promises';
await buildStatic({ outDir: 'dist-cloudflare' });
// Pages resolves extensionless HTML URLs itself; Netlify-specific rules are not used.
await writeFile('dist-cloudflare/_redirects', [
  'https://www.matematicasib.com/* https://matematicasib.com/:splat 301',
  'https://matematicasib.pages.dev/* https://matematicasib.com/:splat 301',
  ''
].join('\n'));
