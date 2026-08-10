import { books } from "@/data/books";
import { getSimilarBooks } from "@/lib/similar-books";
import type { Book } from "@/types/book";
import { BookCard } from "@/components/book/book-card";

// "Similar Books" grid for the detail page: same-author then shared-genre
// matches sorted by rating, capped by SIMILAR_BOOKS_MAX. Renders nothing when
// there are no matches (FR-6.1/6.2/6.3).
export function SimilarBooks({ book }: { book: Book }) {
  const similar = getSimilarBooks(book, books);

  if (similar.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t pt-10">
      <h2 className="font-heading text-2xl font-medium">Similar books</h2>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {similar.map((candidate) => (
          <BookCard key={candidate.id} book={candidate} />
        ))}
      </div>
    </section>
  );
}
