// A single user-written review for a book, keyed by book slug in mock data.
export type Review = {
  id: string;
  bookId: string;
  userName: string;
  rating: number;
  // ISO date string (e.g. "2026-05-02").
  date: string;
  content: string;
};
