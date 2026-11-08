import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../cloudflare/worker.js';
test('Cloudflare redirige www y pages.dev al dominio principal conservando ruta y campaña', async () => {
  for (const host of ['www.matematicasib.com', 'matematicasib.pages.dev']) {
    const result = await worker.fetch(new Request(`https://${host}/contacto?curso=AA&utm_source=google`), {});
    assert.equal(result.status, 301);
    assert.equal(result.headers.get('Location'), 'https://matematicasib.com/contacto?curso=AA&utm_source=google');
  }
});
test('El dominio principal y las vistas previas sirven los assets sin bucles', async () => {
  for (const host of ['matematicasib.com', 'preview.matematicasib.pages.dev']) {
    const request = new Request(`https://${host}/matematicas-aa`);
    const result = await worker.fetch(request, { ASSETS: { fetch: r => { assert.equal(r, request); return new Response('static page'); } } });
    assert.equal(result.status, 200);
    assert.equal(await result.text(), 'static page');
  }
});
