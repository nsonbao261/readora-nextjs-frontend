# Plan — Book Catalog (`/book`)

## Design direction

Same cream / forest-green / Fraunces identity as the landing page. The catalog stays quiet so the covers lead: a left filter rail + main results grid on desktop, toolbar (search + sort) on top, numbered pagination below. No new palette.

## Decisions (confirmed)

- Filter checkboxes via `npx shadcn add checkbox label` → Base UI `src/components/ui/checkbox.tsx` + `label.tsx` (matches repo convention). Fallback: native styled `<input type="checkbox">` if the add fails.
- Pagination is a server component rendering real `next/link` anchors built from a shared URL helper (works with middle-click; no JS needed).
- No `useSearchParams` in client components — the server page parses `searchParams` once into a typed `CatalogState` and passes it as props to controls. Controls build new URLs with a pure `buildCatalogUrl()` helper. Avoids Suspense-boundary requirements and centralizes URL building.
- `date-fns` (already installed) powers the published-date presets — no new dependencies.
- Mock data order keeps distinct covers for the first 8 entries so the home hero strip (first 7) and featured grid (first 6) don't repeat covers.
- Badges/genres on `BookCard`: badges as small pills overlaid on the cover's top-left (wishlist stays top-right); genre as a muted text line; On Sale shows struck-through `originalPrice` + effective `price`. Applied site-wide (home cards benefit too).

---

## Step-by-step implementation

### Step 1 — Extend the `Book` type
- [x] Edit `src/types/book.ts`: `genre: string` → `genres: string[]`; add `publishedDate: string`, `badges: BookBadge[]`, `originalPrice?: number`; export `BookBadge` (`"new-release" | "bestseller" | "on-sale"`) + a `BADGE_LABELS` map for display.

### Step 2 — Expand mock data
- [x] Rewrite `src/data/books.ts` → 34 books spanning ~10 genres, all three badges, mixed sale pricing, and published dates spread across <6mo / 6–12mo / 1–3y so every filter and the 3-page pagination are demonstrable. Fixed ISO dates (deterministic, static-safe).

### Step 3 — Extend `BookCard`
- [x] Edit `src/components/book/book-card.tsx`: genre line, badge pills, discounted-price rendering. No new required props → home/hero keep working (AC-8).

### Step 4 — Add UI primitives
- [x] Run `npx shadcn add checkbox label` → `src/components/ui/checkbox.tsx`, `label.tsx`.

### Step 5 — Catalog logic + URL helpers (`src/lib/catalog.ts`)
- [x] Pure, framework-free module:
  - `CatalogState` type + `DEFAULT_SORT` (`title`, `asc` per FR-2.2)
  - `parseSearchParams(searchParams)` → validated/clamped state (repeatable `genre`/`badge` via `getAll`, numeric `priceMin/Max` guarded so Min ≤ Max, `page` clamped ≥1)
  - `filterBooks()` — case-insensitive title/author `q`; AND across groups, OR within genre/badge; price bounds; `publishedIn` presets via `date-fns subDays`
  - `sortBooks()` — comparator per field (localeCompare for title/author; numeric for price/rating; date for published)
  - `paginate()` → `{ items, total, totalPages, page }` (12/page)
  - `buildCatalogUrl(state, patch)` → `/book?…` string (append repeatable params; resets `page` as needed)
  - `getGenres(books)`, `countActiveFilters(state)`, option constants (`SORT_FIELDS`, `BADGES`, `PUBLISHED_IN_OPTIONS`, `PAGE_SIZE`)

### Step 6 — Catalog page (server)
- [x] Rewrite `src/app/(catalog)/book/page.tsx` as async server component: read `searchParams` → parse → filter/sort/paginate → render toolbar + filter panel + grid of `BookCard`s + result summary ("Showing X–Y of Z books") + pagination. Empty state ("No books match your search") with a Clear filters action.

### Step 7 — Client controls (`src/components/catalog/`)
- [ ] `search-bar.tsx` — controlled input; submits on Enter/Search → URL with `q` + page reset (FR-1.2/1.3); × clears and applies immediately (FR-1.4).
- [ ] `sort-control.tsx` — `Select` (field) + direction toggle button with arrow icon; active field+dir visible (FR-2.4); change → page reset.
- [ ] `filter-panel.tsx` — local draft state seeded from applied state; Apply validates Min ≤ Max then pushes URL (page reset); Clear all resets + applies immediately (FR-3.8); active-count badge next to Apply.

### Step 8 — Pagination
- [ ] `src/components/catalog/pagination.tsx` — server component: First/Prev (left), Next/Last (right), numbered items with ellipsis for large ranges; disabled state styling on page 1 / last page (FR-4.2).

### Step 9 — Verification
- [ ] `npm run lint` · `npx tsc --noEmit` · `npm run build` + manual QA (below).

---

## Critical files touched

| File | Action | Why |
|---|---|---|
| `src/types/book.ts` | Edit | Model change: `genres[]`, `publishedDate`, `badges`, `originalPrice` (FR-5.1) |
| `src/data/books.ts` | Rewrite | 32 books so search/filter/sort/pagination are meaningful (FR-5.2) |
| `src/components/book/book-card.tsx` | Edit | Genre/badges/discount display (spec scope) |
| `src/app/(catalog)/book/page.tsx` | Rewrite | Placeholder → full server-rendered catalog (AC-1) |
| `src/lib/catalog.ts` | New | All pure filter/sort/paginate/URL logic |
| `src/components/ui/checkbox.tsx`, `label.tsx` | New | shadcn Base UI primitives for the filter panel |

Unaffected: home page, hero banner, `book/[id]`, `rating.tsx`, `wishlist-button.tsx` (type change is additive-only, so they compile as-is).

## New components

| Component | Type | Purpose |
|---|---|---|
| `catalog/search-bar.tsx` | client | Submit-based search + clear |
| `catalog/sort-control.tsx` | client | Sort field select + direction toggle |
| `catalog/filter-panel.tsx` | client | Draft-state filter form (genre/badge/price/date) + Apply/Clear all + active count |
| `catalog/pagination.tsx` | server | Numbered pagination with First/Prev/Next/Last + ellipsis |
| `lib/catalog.ts` | pure | Parsing, filtering, sorting, paginating, URL building |

## New routes

None — `/book` already exists in route group `(catalog)`; it just stops being a placeholder. No route-group or folder changes.

## New dependencies required

**None.** `@base-ui/react`, `lucide-react`, `sonner`, shadcn primitives, and `date-fns` (for date presets) are all already installed. Recommended addition only if you want it: none — the stack fully covers this feature.

## Testing strategy

No test framework is configured, so:

- **Static**: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- **Manual QA**: search title/author narrows & survives reload; clear × restores all; each of 4 sort fields × 2 directions reorders + persists in URL; price Min>Max blocked on Apply; genre/badge OR-within-group + AND-across-groups; date presets correct; Apply vs pre-Apply draft behavior; Clear all restores defaults + count resets; pagination = 12/page, First/Prev disabled on p1, Next/Last disabled on last, ellipsis on large ranges, page change preserves state; summary counts correct; empty state reachable; every control state shareable via URL; home `/` still renders with extended `Book`; dark mode + keyboard focus on all controls.
