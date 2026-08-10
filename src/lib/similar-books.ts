import type { Book } from "@/types/book";
import { SIMILAR_BOOKS_MAX } from "@/constants/catalog";

// Returns up to `max` books related to the given book: same-author books
// first, then books sharing at least one genre, each tier sorted by rating
// (desc). The book itself is excluded. Empty when nothing matches.
export function getSimilarBooks(
  book: Book,
  allBooks: Book[],
  max: number = SIMILAR_BOOKS_MAX,
): Book[] {
  const candidates = allBooks.filter((candidate) => candidate.id !== book.id);

  // Helper: true when a candidate shares the current book's author.
  const isSameAuthor = (candidate: Book): boolean =>
    candidate.author === book.author;

  // Helper: true when a candidate shares at least one genre with the book.
  const sharesGenre = (candidate: Book): boolean =>
    candidate.genres.some((genre) => book.genres.includes(genre));

  return candidates
    .filter((candidate) => isSameAuthor(candidate) || sharesGenre(candidate))
    .sort((a, b) => {
      // Author tier outranks the genre tier.
      if (isSameAuthor(a) !== isSameAuthor(b)) {
        return isSameAuthor(a) ? -1 : 1;
      }
      // Within a tier, ties and genre-tier books sort by rating (desc).
      return b.rating - a.rating;
    })
    .slice(0, max);
}
