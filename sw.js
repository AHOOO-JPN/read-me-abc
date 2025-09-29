const CACHE_NAME = "readmeabc-v4";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon/read_me_icon_192.png",
  "./icon/read_me_icon_512.png",
];

// インストール時：基本ファイルをキャッシュ
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 有効化時：古いキャッシュ削除
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// フェッチ時：キャッシュ優先 + 動的キャッシュ（画像/音声も）
self.addEventListener("fetch", (e) => {
  const url = e.request.url;

  // 動的キャッシュ対象：画像と音声
  if (url.match(/\.(png|jpg|jpeg|gif|webp|svg|mp3|wav|ogg)$/i)) {
    e.respondWith(
      caches.match(e.request).then((response) => {
        return (
          response ||
          fetch(e.request).then((res) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, res.clone());
              return res;
            });
          })
        );
      })
    );
    return;
  }

  // デフォルト：キャッシュ優先
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
