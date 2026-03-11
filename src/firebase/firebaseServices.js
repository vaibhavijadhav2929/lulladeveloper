import { ref, push, set, get, remove, update, child } from 'firebase/database';
import { db } from './firebaseConfig';

// ── ADD a new document → returns { id } ──────────────────────────────────────
export const addDocument = async (collectionName, data) => {
    const listRef = ref(db, collectionName);
    const newRef = push(listRef);
    await set(newRef, { ...data, id: newRef.key });
    return { id: newRef.key };
};

// ── GET all documents in a collection ─────────────────────────────────────────
export const getDocuments = async (collectionName) => {
    const snapshot = await get(ref(db, collectionName));
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
};

// ── GET single document by ID ──────────────────────────────────────────────────
export const getDocument = async (collectionName, id) => {
    const snapshot = await get(ref(db, `${collectionName}/${id}`));
    if (!snapshot.exists()) return null;
    return { id, ...snapshot.val() };
};

// ── UPDATE a document ──────────────────────────────────────────────────────────
export const updateDocument = async (collectionName, id, data) => {
    await update(ref(db, `${collectionName}/${id}`), data);
};

// ── DELETE a document ──────────────────────────────────────────────────────────
export const deleteDocument = async (collectionName, id) => {
    await remove(ref(db, `${collectionName}/${id}`));
};
