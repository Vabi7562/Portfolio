export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    // For any 404 (unknown route), serve index.html so React Router handles it.
    // Create a clean GET request; reusing the original Request with a different
    // URL can throw in Workers for non-root custom-domain routes.
    if (response.status === 404) {
      const indexUrl = new URL('/index.html', request.url);
      return env.ASSETS.fetch(new Request(indexUrl, {
        headers: request.headers,
      }));
    }

    return response;
  },
};
