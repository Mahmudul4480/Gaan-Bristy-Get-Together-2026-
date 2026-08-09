const DB_NAME = 'gaan-bristy-guest-photos-2026';
const STORE_NAME = 'photos';
const DB_VERSION = 1;

function openPhotoDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'));
  });
}

export async function persistGuestPhoto(ticketId: string, dataUrl: string): Promise<void> {
  const db = await openPhotoDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(dataUrl, ticketId);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error ?? new Error('Failed to save photo'));
    };
  });
}

export async function readGuestPhoto(ticketId: string): Promise<string | undefined> {
  try {
    const db = await openPhotoDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).get(ticketId);
      request.onsuccess = () => {
        db.close();
        resolve(typeof request.result === 'string' ? request.result : undefined);
      };
      request.onerror = () => {
        db.close();
        reject(request.error ?? new Error('Failed to read photo'));
      };
    });
  } catch {
    return undefined;
  }
}

export async function deleteGuestPhoto(ticketId: string): Promise<void> {
  try {
    const db = await openPhotoDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(ticketId);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error('Failed to delete photo'));
      };
    });
  } catch {
    // Non-fatal if photo delete fails
  }
}
