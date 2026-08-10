import { subDays } from "date-fns";
import type { Book, BookBadge } from "@/types/book";
import { BADGE_LABELS } from "@/types/book";

export const PAGE_SIZE = 12;

export type SortField = "title" | "author" | "price" | "rating" | "published";
export type SortDir = "asc" | "desc";
export type PublishedIn = "any" | "last-6-months" | "last-year" | "last-3-years";

// Fully validated catalog state parsed from URL search params (FR-2.2 default).
export type CatalogState = {
  q: string;
  sortField: SortField;
  sortDir: SortDir;
  genres: string[];
  badges: BookBadge[];
  priceMin?: number;
  priceMax?: number;
  publishedIn: PublishedIn;
  page: number;
};

export const DEFAULT_SORT: { field: SortField; dir: SortDir } = { field: "title", dir: "asc" };

// Option lists rendered by the sort control and filter panel.
export const SORT_FIELDS: { value: SortField; label: string }[] = [
  { value: "title", label: "Title" },
  { value: "author", label: "Author" },
  { value: "price", label: "Price" },
  { value: "rating", label: "Rating" },
  { value: "published", label: "Published date" },
];

export const BADGES: { value: BookBadge; label: string }[] = [
  { value: "new-release", label: BADGE_LABELS["new-release"] },
  { value: "bestseller", label: BADGE_LABELS.bestseller },
  { value: "on-sale", label: BADGE_LABELS["on-sale"] },
];

// Published-date presets, ordered as shown in the filter panel (FR-3.5).
export const PUBLISHED_IN_OPTIONS: { value: PublishedIn; label: string }[] = [
  { value: "last-6-months", label: "Last 6 months" },
  { value: "last-year", label: "Last year" },
  { value: "last-3-years", label: "Last 3 years" },
  { value: "any", label: "Any time" },
];

// Cutoff days (from now) for each published-date preset (FR-3.5).
const PUBLISHED_IN_DAYS: Record<Exclude<PublishedIn, "any">, number> = {
  "last-6-months": 180,
  "last-year": 365,
  "last-3-years": 1095,
};

// Parse a raw searchParams object into a validated, clamped CatalogState.
export function parseSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): CatalogState {
  const single = (key: string): string =>
    Array.isArray(searchParams[key])
      ? (searchParams[key] as string[])[0] ?? ""
      : (searchParams[key] ?? "");
  const list = (key: string): string[] => {
    const value = searchParams[key];
    return Array.isArray(value) ? value : value ? [value] : [];
  };
  const toNum = (value: string): number | undefined => {
    if (value === "") return undefined;
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  };

  const sortField: SortField = SORT_FIELDS.some((f) => f.value === single("sortField"))
    ? (single("sortField") as SortField)
    : DEFAULT_SORT.field;
  const sortDir: SortDir = single("sortDir") === "desc" ? "desc" : "asc";

  const genres = [...new Set(list("genre").map((g) => g.trim()).filter(Boolean))];
  const badges = list("badge")
    .map((b) => b.trim())
    .filter((b): b is BookBadge => b === "new-release" || b === "bestseller" || b === "on-sale");

  let priceMin = toNum(single("priceMin"));
  let priceMax = toNum(single("priceMax"));
  if (priceMin !== undefined && priceMax !== undefined && priceMin > priceMax) {
    [priceMin, priceMax] = [priceMax, priceMin];
  }

  const publishedIn: PublishedIn = PUBLISHED_IN_OPTIONS.some(
    (o) => o.value === single("publishedIn")
  )
    ? (single("publishedIn") as PublishedIn)
    : "any";

  return {
    q: single("q").trim(),
    sortField,
    sortDir,
    genres,
    badges,
    priceMin,
    priceMax,
    publishedIn,
    page: Math.max(1, toNum(single("page")) ?? 1),
  };
}

// Case-insensitive q on title/author; AND across groups, OR within genre/badge.
export function filterBooks(books: Book[], state: CatalogState): Book[] {
  const { q, genres, badges, priceMin, priceMax, publishedIn } = state;
  const qLower = q.toLowerCase();
  const minDate =
    publishedIn === "any" ? undefined : subDays(new Date(), PUBLISHED_IN_DAYS[publishedIn]);

  return books.filter((book) => {
    if (
      qLower &&
      !(book.title.toLowerCase().includes(qLower) || book.author.toLowerCase().includes(qLower))
    )
      return false;
    if (genres.length > 0 && !genres.some((g) => book.genres.includes(g))) return false;
    if (badges.length > 0 && !badges.some((b) => book.badges.includes(b))) return false;
    if (priceMin !== undefined && book.price < priceMin) return false;
    if (priceMax !== undefined && book.price > priceMax) return false;
    if (minDate && new Date(book.publishedDate) < minDate) return false;
    return true;
  });
}

// Stable comparator per sort field; ties fall back to ascending title.
export function sortBooks(books: Book[], field: SortField, dir: SortDir): Book[] {
  const factor = dir === "asc" ? 1 : -1;
  return [...books].sort((a, b) => {
    let result: number;
    switch (field) {
      case "title":
        result = a.title.localeCompare(b.title);
        break;
      case "author":
        result = a.author.localeCompare(b.author);
        break;
      case "price":
        result = a.price - b.price;
        break;
      case "rating":
        result = a.rating - b.rating;
        break;
      case "published":
        result = a.publishedDate.localeCompare(b.publishedDate);
        break;
    }
    if (result === 0) return a.title.localeCompare(b.title);
    return result * factor;
  });
}

// Slice into pages; clamps out-of-range pages to a valid one (FR-4.1).
export function paginate<T>(items: T[], page: number, pageSize: number = PAGE_SIZE) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, totalPages, page: safePage };
}

// Build a `/book?...` URL from a state, applying a patch. Resets page to 1
// whenever q/sort/filters change (FR-1.3, FR-2.3, FR-3.8) unless page is in the patch.
export function buildCatalogUrl(state: CatalogState, patch: Partial<CatalogState> = {}): string {
  const resetsPage =
    patch.page === undefined &&
    (
      ["q", "sortField", "sortDir", "genres", "badges", "priceMin", "priceMax", "publishedIn"] as const
    ).some((key) => JSON.stringify(state[key]) !== JSON.stringify(patch[key]));
  const next: CatalogState = resetsPage
    ? { ...state, ...patch, page: 1 }
    : { ...state, ...patch };

  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.sortField !== DEFAULT_SORT.field) params.set("sortField", next.sortField);
  if (next.sortDir !== DEFAULT_SORT.dir) params.set("sortDir", next.sortDir);
  next.genres.forEach((g) => params.append("genre", g));
  next.badges.forEach((b) => params.append("badge", b));
  if (next.priceMin !== undefined) params.set("priceMin", String(next.priceMin));
  if (next.priceMax !== undefined) params.set("priceMax", String(next.priceMax));
  if (next.publishedIn !== "any") params.set("publishedIn", next.publishedIn);
  if (next.page > 1) params.set("page", String(next.page));

  const qs = params.toString();
  return qs ? `/book?${qs}` : "/book";
}

// Alphabetical list of every genre present in the dataset (FR-3.2).
export function getGenres(books: Book[]): string[] {
  return [...new Set(books.flatMap((b) => b.genres))].sort((a, b) => a.localeCompare(b));
}

// Number of non-default filter groups (genre/badge/price/date); q and sort excluded.
export function countActiveFilters(state: CatalogState): number {
  let count = 0;
  if (state.genres.length > 0) count += 1;
  if (state.badges.length > 0) count += 1;
  if (state.priceMin !== undefined || state.priceMax !== undefined) count += 1;
  if (state.publishedIn !== "any") count += 1;
  return count;
}
