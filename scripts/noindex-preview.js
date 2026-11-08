import { appendFile } from 'node:fs/promises';
await appendFile('dist/_headers', '\n/*\n  X-Robots-Tag: noindex, follow\n');
