/* Festi Crew: funciona sin señal.
   - La app (index.html) se pide primero a la red para recibir actualizaciones; si no hay señal, sale de la caché.
   - Fuentes, iconos y el SDK de Firebase salen de la caché (cambian poco).
   - Los datos del crew los guarda Firestore en el teléfono; este archivo no los toca. */
const CACHE = 'festi-crew-v3';
const CORE = ['./', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const isStatic = url =>
  url.origin === 'https://fonts.googleapis.com' ||
  url.origin === 'https://fonts.gstatic.com' ||
  (url.origin === 'https://www.gstatic.com' && url.pathname.startsWith('/firebasejs/')) ||
  (url.origin === self.location.origin && /\.(png|webmanifest|js)$/.test(url.pathname));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Navegación / la app: red primero, caché si no hay señal
  if (req.mode === 'navigate' || (url.origin === self.location.origin && url.pathname.endsWith('.html'))) {
    e.respondWith(
      fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }
  // Estáticos: caché primero, y se guarda lo nuevo
  if (isStatic(url)) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }))
    );
  }
  // Todo lo demás (Firestore, autenticación) va directo a la red.
});
