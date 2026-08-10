import Image from "next/image";
import Link from "next/link";

import { books } from "@/data/books";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Fanned cover strip — the hero's signature visual. Covers overlap from left
// to right at alternating angles and straighten on hover.
function CoverStrip() {
  const stripBooks = books.slice(0, 7);

  return (
    <div aria-hidden="true" className="mt-14 flex items-end justify-center sm:mt-16">
      {stripBooks.map((book, i) => (
        <div
          key={book.id}
          className={cn(
            "w-16 transition-transform duration-300 hover:-translate-y-1.5 hover:rotate-0 sm:w-24 lg:w-28",
            i > 0 && "-ml-4 sm:-ml-6",
            i === 0 && "-rotate-6",
            i === 1 && "-rotate-3",
            i === 2 && "-rotate-1",
            i === 4 && "rotate-1",
            i === 5 && "rotate-3",
            i === 6 && "rotate-6",
          )}
        >
          <Image
            src={book.cover}
            alt=""
            width={160}
            height={240}
            className="aspect-[2/3] h-auto w-full rounded-md object-cover shadow-lg ring-1 ring-foreground/10"
          />
        </div>
      ))}
    </div>
  );
}

// Landing hero: eyebrow, headline, subheadline, and CTAs anchored by the
// signature fanned cover strip.
export function HeroBanner() {
  return (
    <section className="overflow-hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
          Readora — Independent bookshop
        </p>
        <h1 className="font-heading mt-4 max-w-2xl text-4xl leading-tight font-medium tracking-tight text-balance sm:text-6xl">
          Books worth keeping on the shelf.
        </h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
          A curated shelf of new releases, forgotten favorites, and the
          occasional paperback that becomes a permanent resident.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/book"
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "h-11 px-7")}
          >
            Browse the books
          </Link>
          <Link
            href="/collections"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-7")}
          >
            Shop by collection
          </Link>
        </div>
        <CoverStrip />
      </div>
    </section>
  );
}
