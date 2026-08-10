// Store badges a book can carry; drives filter options and card pills.
export type BookBadge = "new-release" | "bestseller" | "on-sale";

// Human-readable labels for the badge keys (used on cards, filters, summaries).
export const BADGE_LABELS: Record<BookBadge, string> = {
  "new-release": "New Release",
  bestseller: "Best Seller",
  "on-sale": "On Sale",
};

// Core book record shared by catalog cards, detail pages, and featured sections.
export type Book = {
  id: string;
  title: string;
  author: string;
  cover: string;
  genres: string[];
  price: number;
  rating: number;
  ratingCount: number;
  // ISO date string (e.g. "2026-03-14"); powers the published-date filters.
  publishedDate: string;
  badges: BookBadge[];
  // Present for discounted (On Sale) items; `price` is the effective sale price.
  originalPrice?: number;
};
