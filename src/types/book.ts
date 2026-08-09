// Core book record shared by catalog cards, detail pages, and featured sections.
export type Book = {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string;
  price: number;
  rating: number;
  ratingCount: number;
};
