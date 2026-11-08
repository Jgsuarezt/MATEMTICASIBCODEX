// Pages advanced mode: canonical host redirects, then unchanged static assets.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (['www.matematicasib.com', 'matematicasib.pages.dev'].includes(url.hostname)) {
      url.hostname = 'matematicasib.com';
      url.protocol = 'https:';
      url.port = '';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  }
};
