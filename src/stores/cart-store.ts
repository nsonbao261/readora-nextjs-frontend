import { create } from "zustand";

// A single line item in the cart (UI-only, in-memory, not persisted).
export type CartItem = {
  bookId: string;
  title: string;
  cover: string;
  price: number;
  quantity: number;
};

// The parts of a book required to add it to the cart (quantity is derived).
export type NewCartItem = {
  bookId: string;
  title: string;
  cover: string;
  price: number;
};

// CartStore holds cart line items and derives subtotal + count.
type CartState = {
  items: CartItem[];
  // Adds a book, incrementing quantity when it is already in the cart.
  addItem: (book: NewCartItem) => void;
  // Removes a line item entirely.
  removeItem: (bookId: string) => void;
  // Clears the whole cart.
  clear: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (book) =>
    set((state) => {
      const existing = state.items.find((item) => item.bookId === book.bookId);
      if (existing) {
        // FR-3.2: increment quantity instead of duplicating the line.
        return {
          items: state.items.map((item) =>
            item.bookId === book.bookId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return { items: [...state.items, { ...book, quantity: 1 }] };
    }),
  removeItem: (bookId) =>
    set((state) => ({
      items: state.items.filter((item) => item.bookId !== bookId),
    })),
  clear: () => set({ items: [] }),
}));

// Derived subtotal (price × quantity) across all cart items.
export function selectSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Derived total number of units in the cart.
export function selectCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
