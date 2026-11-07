// Hors connexion : la page vient du réseau si possible (nouvelle version), sinon du cache.
const V = "kc-637243d580";
const CORE = ["./", "index.html", "manifest.webmanifest", "three.min.js", "fonts/fonts.css", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/favicon-64.png", "fonts/space-grotesk-latin-ext-500-normal.woff2", "fonts/space-grotesk-latin-500-normal.woff2", "fonts/space-grotesk-latin-ext-700-normal.woff2", "fonts/space-grotesk-latin-700-normal.woff2", "fonts/inter-latin-ext-400-normal.woff2", "fonts/inter-latin-400-normal.woff2", "fonts/inter-latin-ext-500-normal.woff2", "fonts/inter-latin-500-normal.woff2", "fonts/inter-latin-ext-600-normal.woff2", "fonts/inter-latin-600-normal.woff2", "fonts/patrick-hand-latin-ext-400-normal.woff2", "fonts/patrick-hand-latin-400-normal.woff2", "fonts/atkinson-hyperlegible-latin-ext-400-normal.woff2", "fonts/atkinson-hyperlegible-latin-400-normal.woff2", "fonts/atkinson-hyperlegible-latin-ext-700-normal.woff2", "fonts/atkinson-hyperlegible-latin-700-normal.woff2", "fonts/atkinson-hyperlegible-latin-ext-400-italic.woff2", "fonts/atkinson-hyperlegible-latin-400-italic.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url); if (u.origin !== location.origin || u.pathname.includes("/videos/") || u.pathname.endsWith("version.json")) return;  // vidéos et version : toujours du réseau
  if (r.mode === "navigate" || u.pathname.endsWith("/") || u.pathname.endsWith("/index.html")) {
    e.respondWith(fetch(r.url, { cache: "no-cache", credentials: "same-origin" }).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put("index.html", cp)); } return res; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; })));
});
