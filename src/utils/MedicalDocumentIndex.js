const DB_NAME = 'life-tracker-medical-library';
const STORE = 'pages';

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveDocumentPages(resourceId, pages) {
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const cursor = store.openCursor();
    cursor.onsuccess = () => {
      const item = cursor.result;
      if (!item) {
        pages.forEach((page) => store.put({ ...page, resourceId, id: `${resourceId}:${page.page}` }));
        return;
      }
      if (item.value.resourceId === resourceId) item.delete();
      item.continue();
    };
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return pages.length;
}

export async function getIndexedResourceIds() {
  const db = await openDb();
  const ids = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).getAllKeys();
    request.onsuccess = () => resolve([...new Set(request.result.map((key) => String(key).split(':')[0]))]);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return ids;
}

export async function searchDocumentPages(resourceIds, query, limit = 8) {
  const db = await openDb();
  const pages = await new Promise((resolve, reject) => {
    const request = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  db.close();
  const terms = [...new Set(query.toLowerCase().match(/[a-z]{4,}/g) || [])];
  return pages.filter((page) => resourceIds.includes(page.resourceId) && page.text)
    .map((page) => ({ ...page, score: terms.reduce((score, term) => score + (page.text.toLowerCase().includes(term) ? 1 : 0), 0) }))
    .filter((page) => page.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
