# Book Catalog Page (`/book`) — Specification

**Feature:** Book Catalog (`/book` route)
**Version:** 1.0
**Status:** Confirmed

## 1. Feature Overview

Build the book catalog page at `/book` — currently an "under construction" placeholder — into a browsable, filterable storefront grid. Users can search the catalog, sort results, narrow them with filters (price, genre, store badges, published date), and page through results. All catalog state lives in the URL query string so views are shareable and bookmarkable.

The catalog is UI-only for now: it reads from the in-repo mock book data. Search, sort, filter, and pagination run against that mock dataset.

## 2. Scope

### In Scope

- Full catalog page at `/book` with a results grid, toolbar (search + sort), filter panel, and pagination.
- Search by book title and author name (submit-based).
- Sort by price, rating, published date, and title, each with ascending/descending direction.
- Filters: price min/max (numeric inputs, no slider), genre multi-select, store badge multi-select (New Release / Bestseller / On Sale), published-date preset ranges.
- Numbered pagination (12 books per page) with First/Previous/Next/Last controls.
- URL-driven state (`q`, sort, filters, `page`) — shareable and bookmarkable.
- Extend the `Book` data model to support multi-genre, published date, badges, and sale pricing.
- Expand mock data (~30+ books) so search, filters, and pagination are meaningful.
- Reuse/extend the existing `BookCard` to show genre, badges, and discounted pricing.

### Out of Scope

- Backend/API integration, real search index, or authentication.
- Price slider UI, infinite scroll, or "load more".
- Search beyond title/author (no description/full-text).
- Catalog features on admin pages, wishlist/cart integration on the catalog page.
- CSS/styling details (design handled in implementation, not this spec).

## 3. Functional Requirements

### 3.1 Search

- **FR-1.1** A search input at the top of the catalog filters the grid by a case-insensitive substring match against a book's **title** and **author**.
- **FR-1.2** Search is **submit-based**: it applies when the user presses **Enter** or clicks a **Search** button — not while typing.
- **FR-1.3** The submitted term persists in the URL as `q` and the page resets to 1 on submit.
- **FR-1.4** The input is clearable via a clear (×) control; clearing restores the unfiltered list.

### 3.2 Sorting

- **FR-2.1** Results sort by a **field** (Price, Rating, Published date, Title) combined with a **direction** toggle (Ascending / Descending).
- **FR-2.2** Default state: Title, ascending.
- **FR-2.3** Sort state persists in the URL (`sortField`, `sortDir`) and is shareable; changing it resets the page to 1.
- **FR-2.4** The active field + direction are clearly indicated in the sort control.

### 3.3 Filtering

- **FR-3.1** **Price range** — two numeric inputs (Min, Max) in VND, no slider. Either side may be left blank (open-ended). Values are validated so Min ≤ Max before applying.
- **FR-3.2** **Genre** — multi-select checkboxes derived from the genres present in the data. Each book can belong to multiple genres. A book matches if it has **at least one** selected genre (OR within the group).
- **FR-3.3** **Badges** — multi-select for store badges: **New Release**, **Bestseller**, **On Sale**. Same OR-within-group matching as genre.
- **FR-3.4** Filter groups combine with AND semantics across groups (e.g., genre AND badge AND price AND date).
- **FR-3.5** **Published date** — preset ranges: **Any time** (default), **Last 6 months**, **Last year**, **Last 3 years**.
- **FR-3.6** Filters are **submit-based**: selecting values updates the form, but results (and the URL) only change when the user clicks an **Apply filters** button (or presses Enter). Adjustments made before applying do not disturb the current results.
- **FR-3.7** All applied filters are reflected in the URL (`genre`/`badge` repeatable, `priceMin`, `priceMax`, `publishedIn`) and are shareable/bookmarkable.
- **FR-3.8** A **Clear all** control resets every filter to its default and reapplies immediately. The active filter count is shown next to the Apply button. Any applied change resets the page to 1.

### 3.4 Pagination

- **FR-4.1** 12 books per page.
- **FR-4.2** Numbered page controls: **First** and **Previous** buttons on the left, **Next** and **Last** buttons on the right, plus page-number buttons (with ellipsis for large ranges). First/Previous are disabled on page 1; Next/Last are disabled on the final page.
- **FR-4.3** Current page persists in the URL as `page`; navigating pages keeps all other state intact.
- **FR-4.4** A result summary ("Showing X–Y of Z books") accompanies the grid.

## 4. Data Model

- **FR-5.1** Extend `Book`:
  - `genres: string[]` (replaces the single `genre: string`).
  - `publishedDate: string` (ISO date).
  - `badges: Badge[]` — zero or more of **New Release**, **Bestseller**, **On Sale**.
  - `originalPrice?: number` — present for discounted (On Sale) items; `price` is the effective sale price.
- **FR-5.2** Expand mock data to ~30+ books spanning multiple genres, badges, dates, and price points so every filter/sort/pagination behavior is demonstrable.
- **FR-5.3** Existing consumers of `Book` (homepage featured grid, hero strip, `BookCard`) keep working after the type change.

## 5. State & URL Behavior

- Route: `/book` (route group `(catalog)`).
- Query params: `q`, `sortField`, `sortDir`, `genre` (repeatable), `badge` (repeatable), `priceMin`, `priceMax`, `publishedIn`, `page`.
- The server page reads `searchParams` and produces the filtered/sorted/paginated result set; client components render the controls and update the URL.
- Page resets to 1 whenever `q`, sort, or any filter changes.
- URL always reflects the currently applied catalog state (shareable/bookmarkable).

## 6. Acceptance Criteria

1. `/book` renders a grid of books instead of the placeholder.
2. Submitting a search term in title or author narrows results; clearing it restores all.
3. Each sort field + direction reorders results and survives a page reload via the URL.
4. Price min/max, genre multi-select, badge multi-select, and published-date presets correctly narrow results and combine with AND semantics.
5. Filters only take effect after Apply; Clear all restores defaults immediately.
6. Pagination shows 12 books/page with First/Previous/Next/Last controls, correct disable states, and a result summary.
7. Every meaningful combination of search/sort/filter/page is reproducible from its URL.
8. Existing home page (`/`) renders correctly with the extended `Book` type.
