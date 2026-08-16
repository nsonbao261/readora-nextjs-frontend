import { books } from "@/data/books";
import { BookCard } from "@/components/book/book-card";
import { HeroBanner } from "@/components/landing/hero-banner";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <section className="mx-auto w-full max-w-6xl px-4 pt-16 pb-24 sm:px-6 sm:pt-20">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
            This week
          </p>
          <h2 className="font-heading text-3xl font-medium tracking-tight text-balance sm:text-4xl">
            Featured books
          </h2>
          <p className="text-muted-foreground">
            Hand-picked from the shelf — six titles worth your time.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {books.slice(0, 5).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </>
  );
}
