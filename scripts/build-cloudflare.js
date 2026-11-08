import { buildStatic } from './static-build.js';
import { cp, rm } from 'node:fs/promises';
await buildStatic({ outDir: 'dist-cloudflare' });
// Pages resolves extensionless HTML itself. Domain redirects require a Function;
// Pages _redirects only supports path-level sources, unlike Netlify.
await rm('dist-cloudflare/_redirects', { force: true });
await cp('cloudflare/worker.js', 'dist-cloudflare/_worker.js');
