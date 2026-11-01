/**
 * IndexedDB storage utility for large certificate files and attachments.
 * Bypasses the strict 5MB quota limit of browser localStorage.
 */

const DB_NAME = 'CertiChainFilesDB';
const DB_VERSION = 1;
const STORE_NAME = 'files';

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const FileStorage = {
  /**
   * Saves a File or Blob to IndexedDB
   * Returns a lightweight reference URI: idb://<file_id>
   */
  async saveFile(file) {
    if (!file) return null;

    try {
      const db = await openDB();
      if (!db) return null;

      const fileId = 'file-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
      
      const record = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        data: file, // Store the Blob/File directly
        created_at: new Date().toISOString()
      };

      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(record);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });

      return `idb://${fileId}`;
    } catch (err) {
      console.warn('IndexedDB file save error:', err);
      return null;
    }
  },

  /**
   * Retrieves a Blob / Object URL by ID
   */
  async getFileUrl(fileUri) {
    if (!fileUri) return null;
    if (fileUri.startsWith('http://') || fileUri.startsWith('https://') || fileUri.startsWith('blob:')) {
      return fileUri;
    }

    if (!fileUri.startsWith('idb://')) return fileUri;
    const fileId = fileUri.replace('idb://', '');

    try {
      const db = await openDB();
      if (!db) return null;

      const record = await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(fileId);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      if (record && record.data) {
        return URL.createObjectURL(record.data);
      }
      return null;
    } catch (err) {
      console.warn('IndexedDB file load error:', err);
      return null;
    }
  }
};
