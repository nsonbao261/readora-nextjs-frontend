import Link from "next/link";

import { books } from "@/data/books";
import { BookCard } from "@/components/book/book-card";
import { buttonVariants } from "@/components/ui/button";
import { SearchBar } from "@/components/catalog/search-bar";
import { SortControl } from "@/components/catalog/sort-control";
import { FilterPanel } from "@/components/catalog/filter-panel";
import { Pagination } from "@/components/catalog/pagination";
import {
  parseSearchParams,
  filterBooks,
  sortBooks,
  paginate,
  buildCatalogUrl,
  getGenres,
  PAGE_SIZE,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";

type CatalogSearchParams = Promise<Record<string, string | string[] | undefined>>;

// Server-rendered catalog: searchParams → parse → filter/sort/paginate → render.
export default async function CatalogPage({
  searchParams,
}: {
  searchParams: CatalogSearchParams;
}) {
  const state = parseSearchParams(await searchParams);
  const genres = getGenres(books);
  const filtered = sortBooks(filterBooks(books, state), state.sortField, state.sortDir);
  const { items, total, totalPages, page } = paginate(filtered, state.page, PAGE_SIZE);

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const clearAllUrl = buildCatalogUrl(state, {
    q: "",
    sortField: "title",
    sortDir: "asc",
    genres: [],
    badges: [],
    priceMin: undefined,
    priceMax: undefined,
    publishedIn: "any",
    page: 1,
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-12 pb-24 sm:px-6 sm:pt-16">
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
          Catalog
        </p>
        <h1 className="mt-1 font-heading text-3xl font-medium tracking-tight text-balance sm:text-4xl">
          Browse the shelves
        </h1>
        <p className="mt-2 text-muted-foreground">
          Search, filter, and sort our collection of {books.length} books.
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar state={state} className="w-full sm:max-w-sm" />
        <SortControl state={state} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <FilterPanel
          state={state}
          genres={genres}
          className="lg:sticky lg:top-6 lg:self-start"
        />
        <div className="flex flex-col gap-6">
          <p role="status" className="text-sm text-muted-foreground">
            Showing {from}–{to} of {total} book{total === 1 ? "" : "s"}
          </p>

          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
              <h2 className="font-heading text-xl font-medium">No books match your search</h2>
              <p className="text-muted-foreground">
                Try a different term or clear your filters.
              </p>
              <Link
                href={clearAllUrl}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}

          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} state={state} />}
        </div>
      </div>
    </div>
  );
}
