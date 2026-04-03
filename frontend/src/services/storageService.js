import { openDB } from 'idb';

const DB_NAME = 'disaster-mesh-db';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('packets')) {
        db.createObjectStore('packets', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('offlineData')) {
        db.createObjectStore('offlineData', { keyPath: 'id' });
      }
    },
  });
}

export async function savePacket(packet) {
  const db = await initDB();
  await db.put('packets', packet);
}

export async function getPackets() {
  const db = await initDB();
  return db.getAll('packets');
}

export async function clearPackets() {
  const db = await initDB();
  await db.clear('packets');
}

export async function seedOfflineData() {
  const db = await initDB();
  const tx = db.transaction('offlineData', 'readwrite');
  const store = tx.objectStore('offlineData');
  
  await store.put({
    id: 'first_aid',
    title: 'First Aid Guides',
    content: '1. CPR: Push hard and fast in the center of the chest.\n2. Bleeding: Apply direct pressure with a clean cloth.\n3. Burns: Cool under running water for 10 minutes.'
  });
  
  await store.put({
    id: 'evac_routes',
    title: 'Evacuation Routes',
    content: 'Follow Route A to the Northern Hills Shelter. Avoid Route B due to potential flooding. Maintain radio silence unless necessary.'
  });
  
  await store.put({
    id: 'emergency_contacts',
    title: 'Emergency Contacts',
    content: 'Responder HQ: 555-0199\nLocal Hospital: 555-0100\nRelay Frequency: 146.520 MHz'
  });
  
  await tx.done;
}

export async function getOfflineData() {
  const db = await initDB();
  return db.getAll('offlineData');
}
