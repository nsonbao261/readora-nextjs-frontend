import { create } from "zustand";

// A personal collection a signed-in user keeps books in (UI-only, in-memory).
export type Collection = {
  id: string;
  name: string;
  bookIds: string[];
};

// CollectionsStore holds seeded collections and actions to add books / create,
// rename, and delete collections. Nothing persists across reloads.
type CollectionsState = {
  collections: Collection[];
  // Adds the given book to every collection id in `ids` (deduped).
  addBookToCollections: (bookId: string, ids: string[]) => void;
  // Creates a new (empty) collection; returns its id.
  createCollection: (name: string) => string;
  // Renames an existing collection.
  renameCollection: (id: string, name: string) => void;
  // Deletes a collection entirely.
  deleteCollection: (id: string) => void;
  // Removes a single book from a collection (keeps the collection record).
  removeBookFromCollection: (collectionId: string, bookId: string) => void;
};

// Seed ids are stable so seeded books can be demo'd out of the box.
export const useCollectionsStore = create<CollectionsState>((set) => ({
  collections: [
    { id: "to-read", name: "To Read", bookIds: [] },
    { id: "favorites", name: "Favorites", bookIds: [] },
    { id: "gift-ideas", name: "Gift Ideas", bookIds: [] },
  ],
  addBookToCollections: (bookId, ids) =>
    set((state) => ({
      collections: state.collections.map((collection) =>
        ids.includes(collection.id) &&
        !collection.bookIds.includes(bookId)
          ? { ...collection, bookIds: [...collection.bookIds, bookId] }
          : collection,
      ),
    })),
  createCollection: (name) => {
    const id = `collection-${crypto.randomUUID()}`;
    set((state) => ({
      collections: [...state.collections, { id, name, bookIds: [] }],
    }));
    return id;
  },
  renameCollection: (id, name) =>
    set((state) => ({
      collections: state.collections.map((collection) =>
        collection.id === id ? { ...collection, name } : collection,
      ),
    })),
  deleteCollection: (id) =>
    set((state) => ({
      collections: state.collections.filter(
        (collection) => collection.id !== id,
      ),
    })),
  removeBookFromCollection: (collectionId, bookId) =>
    set((state) => ({
      collections: state.collections.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              bookIds: collection.bookIds.filter((id) => id !== bookId),
            }
          : collection,
      ),
    })),
}));
