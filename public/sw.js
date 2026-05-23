define(['./workbox-e43f5367'], (function (workbox) {
  'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  // Cache the start URL with NetworkFirst
  workbox.registerRoute(
    "/",
    new workbox.NetworkFirst({
      cacheName: "start-url",
      plugins: [{
        cacheWillUpdate: async ({ response }) => {
          if (response && response.type === 'opaqueredirect') {
            return new Response(response.body, {
              status: 200,
              statusText: 'OK',
              headers: response.headers
            });
          }
          return response;
        }
      }]
    }),
    'GET'
  );

  // Cache pages (HTML) - NetworkFirst so fresh content loads when online
  workbox.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.NetworkFirst({
      cacheName: "pages",
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 24 * 60 * 60 // 1 day
        })
      ]
    })
  );

  // Cache static assets (JS, CSS) - StaleWhileRevalidate
  workbox.registerRoute(
    ({ request }) =>
      request.destination === 'script' ||
      request.destination === 'style',
    new workbox.StaleWhileRevalidate({
      cacheName: "static-assets",
      plugins: [
        new workbox.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
        })
      ]
    })
  );

  // Cache images - CacheFirst (images rarely change)
  workbox.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.CacheFirst({
      cacheName: "images",
      plugins: [
        new workbox.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        })
      ]
    })
  );

  // Cache Google Fonts
  workbox.registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com',
    new workbox.StaleWhileRevalidate({ cacheName: "google-fonts-stylesheets" })
  );

  workbox.registerRoute(
    ({ url }) => url.origin === 'https://fonts.gstatic.com',
    new workbox.CacheFirst({
      cacheName: "google-fonts-webfonts",
      plugins: [
        new workbox.ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
        })
      ]
    })
  );

  // API calls - NetworkOnly (always fresh, no caching)
  workbox.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new workbox.NetworkOnly({ cacheName: "api" })
  );

}));