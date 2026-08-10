# Plan — Book Detail Page (`/book/[slug]`)

## Design direction

Same cream / forest-green / Fraunces identity as the landing page and catalog. The detail page is cover-first: a large cover on the left, info column on the right (title, author, genres, badges, rating, published date, price, synopsis). Actions below the price as a clear button group (Buy Now → Add to Cart → wishlist icon → Add to Collection). Below the fold: a quiet shipping row, a "Similar Books" grid reusing `BookCard`, then the Reviews section. No new palette.

## Decisions (confirmed)

- Same-author tier is currently untestable: every one of the 34 authors is unique. Add **2 new books by existing authors** (a 2nd Mira Voss + 2nd Rowan Hale, reusing covers) so the same-author-first ranking (FR-6.1, AC-5) is demonstrable. Catalog count goes 34 → 36 (page 3 gains 2 cards; the "34 books" string reads `books.length` dynamically so it stays correct).
- Extract `formatPrice` out of `book-card.tsx` into a new `src/lib/format.ts` (+ a `formatDate` via `date-fns`), reused by the detail page. `book-card.tsx` refactored to import it — zero visual change.
- Extend `WishlistButton` with optional `label`/`size` props (default behavior unchanged for cards) so the detail page can render it as a labeled outline button.
- New shared client component `shared/login-gate-dialog.tsx` (the existing guest → Dialog → `/login` gate, extracted pattern) reused by review form + add-to-collection; `WishlistButton` keeps its own (no churn).
- Reviews are keyed by slug in `src/data/reviews.ts`; books without seeded reviews show an empty state ("No reviews yet — be the first to write one").
- Add `generateMetadata` (title/description from the book) — small, free.
- Constants: `SHIPPING_FEE = 25000`, `FREE_SHIPPING_THRESHOLD = 500000` in `src/constants/shipping.ts`; `SIMILAR_BOOKS_MAX = 8` in `src/constants/catalog.ts`.
- **Follow-up:** navbar gains an always-visible cart icon with a live count badge (`selectCount` from the cart store, hidden at 0) linking to `/cart`. The Add-to-Collection sheet gains per-collection rename (inline input) and delete (confirm dialog) via a kebab `DropdownMenu`; the store adds `renameCollection`/`deleteCollection`.

---

## Step-by-step implementation

### Step 1 — Shared format helpers ✅
- [x] Create `src/lib/format.ts`: `formatPrice(price)` (moves the `Intl.NumberFormat("vi-VN", …)` logic out of `book-card.tsx`) + `formatDate(iso)` using `date-fns` `format(date, "MMMM d, yyyy")`.
- [x] Edit `src/components/book/book-card.tsx`: remove the private `formatPrice`, import from `@/lib/format`. No other changes.

### Step 2 — Types ✅
- [x] Edit `src/types/book.ts`: add `description: string` (required, additive — no other file breaks).
- [x] Create `src/types/review.ts`: `Review = { id, bookId, userName, rating, date, content }`.

### Step 3 — Mock data ✅
- [x] Edit `src/data/books.ts`: seed a 1–3 sentence `description` for all 34 books; add 2 new books sharing authors (Mira Voss, Rowan Hale) so the similar-books author tier is reachable. (Now 36 books.)
- [x] Create `src/data/reviews.ts`: `reviewsBySlug: Record<string, Review[]>` with 3–5 seeded reviews for the primary books (first 8 + a few popular ones).

### Step 4 — Constants ✅
- [x] Create `src/constants/shipping.ts` — `SHIPPING_FEE`, `FREE_SHIPPING_THRESHOLD`.
- [x] Create `src/constants/catalog.ts` — `SIMILAR_BOOKS_MAX`.

### Step 5 — Stores ✅
- [x] Create `src/stores/cart-store.ts`: `CartItem = { bookId, title, cover, price, quantity }`; `addItem(book)` increments quantity when `bookId` exists (FR-3.2), otherwise pushes qty 1; selectors/derived `subtotal` (price×qty) and `count`.
- [x] Create `src/stores/collections-store.ts`: `Collection = { id, name, bookIds }`; seeded with 2–3 default collections (FR-7.4); actions `createCollection(name)`, `addBookToCollections(bookId, ids[])`.

### Step 6 — shadcn primitive ✅
- [x] Run `npx shadcn add textarea` → `src/components/ui/textarea.tsx` (Base UI, no new npm package) for the review form.

### Step 7 — Similar-books logic ✅
- [x] Create `src/lib/similar-books.ts`: `getSimilarBooks(book, allBooks, max)` — excludes self; ranks same-author first, then shared-genre, ties by rating desc; returns up to `SIMILAR_BOOKS_MAX`; empty array if no matches.

### Step 8 — Book-detail client components ✅
- [x] Edit `src/components/book/wishlist-button.tsx`: optional `label` + `size` props (defaults keep card behavior).
- [x] Create `src/components/shared/login-gate-dialog.tsx`: guest gate (title/description/CTA → `/login`).
- [x] Create `src/components/book/cart-actions.tsx`: client — **Add to Cart** (`addItem` + `toast.success`) and **Buy Now** (`addItem` + `router.push("/checkout")`, FR-2.1).
- [x] Create `src/components/book/add-to-collection-button.tsx`: client — guest → login gate; signed-in → `Sheet` (right) listing collections with `Checkbox`+`Label`, an `Input` to create a new collection, Save → `addBookToCollections` + toast (FR-7.2/7.3).

### Step 9 — Book-detail server components ✅
- [x] Create `src/components/book/shipping-info.tsx`: server — renders fee / "Free shipping" / "add X more for free shipping" from the two constants (FR-5.1/5.2).
- [x] Create `src/components/book/review-form.tsx`: client — 5 interactive star buttons + `Textarea`; guest → login gate; submit → toast, clear + submitted state (FR-8.4/8.5).
- [x] Create `src/components/book/reviews-section.tsx`: server — header summary (reuses `Rating`), seeded review list, `ReviewForm`; empty state when none.
- [x] Create `src/components/book/similar-books.tsx`: server — `BookCard` grid; hidden when `getSimilarBooks` returns nothing (FR-6.3).

### Step 10 — Route rename + page rewrite ✅
- [x] Rename `src/app/(catalog)/book/[id]` → `src/app/(catalog)/book/[slug]` (folder move via `git mv`; URL unchanged — ids are already slugs, AC-8).
- [x] Rewrite `[slug]/page.tsx` (server): `notFound()` on unknown slug (FR-1.2, AC-1); two-column hero (cover | info incl. badges, `Rating`, price + sale, description); action group (cart-actions + wishlist + add-to-collection); shipping-info; similar-books; reviews-section.
- [x] Add `generateMetadata` from the matched book.

### Step 11 — Verification ✅
- [x] `npm run lint` · `npx tsc --noEmit` (after `next typegen`) · `npm run build` pass. Manual QA is the remaining check (below).

---

## Critical files touched

| File | Action | Why |
|---|---|---|
| `src/app/(catalog)/book/[id]/page.tsx` | Rename → `[slug]`, rewrite | Placeholder → full server-rendered detail page (AC-1); segment rename (FR-1.1) |
| `src/types/book.ts` | Edit | Add `description` (FR-9.1) |
| `src/data/books.ts` | Edit | Seed descriptions + 2 author-sharing books (FR-9.1, FR-6.1 demo) |
| `src/components/book/book-card.tsx` | Edit | Use shared `formatPrice` from `lib/format.ts` |
| `src/components/book/wishlist-button.tsx` | Edit | Optional label/size for detail-page use (FR-4.x reuse) |

## New components

| Component | Type | Purpose |
|---|---|---|
| `book/cart-actions.tsx` | client | Add to Cart (toast) + Buy Now (add → `/checkout`) |
| `book/add-to-collection-button.tsx` | client | Auth-gated sheet: select/create collections → save + toast |
| `book/review-form.tsx` | client | Star rating + textarea review, auth-gated, submitted state |
| `book/reviews-section.tsx` | server | Header summary + seeded review list + form/empty state |
| `book/similar-books.tsx` | server | `BookCard` grid, hidden when no matches |
| `book/shipping-info.tsx` | server | Flat fee / free-shipping-over-threshold messaging |
| `shared/login-gate-dialog.tsx` | client | Reusable guest login-gate dialog (used by review + collection) |

## New routes / files

- `src/app/(catalog)/book/[slug]/page.tsx` — replaces `[id]` folder (URL unchanged).
- `src/types/review.ts`, `src/data/reviews.ts`, `src/stores/cart-store.ts`, `src/stores/collections-store.ts`, `src/constants/shipping.ts`, `src/constants/catalog.ts`, `src/lib/format.ts`, `src/lib/similar-books.ts`.
- `src/components/ui/textarea.tsx` (shadcn-generated).

## New dependencies required

**None (npm).** `zustand`, `sonner`, `lucide-react`, `date-fns`, `@base-ui/react` and all shadcn primitives are installed. The only addition is `npx shadcn add textarea`, which generates a Base UI component without a new package. No new dependencies are recommended — the stack fully covers this feature.

## Testing strategy

No test framework is configured, so:

- **Static**: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- **Manual QA (per AC)**: every seeded slug renders full info (badges, rating, sale price, description); unknown slug → 404; Add to Cart toasts + increments on re-add (store holds qty 2); Buy Now lands on `/checkout`; guest wishlist/collection/review all show login gate → `/login`; signed-in toggling/toasts work; shipping shows fee vs. free (pick a book above/below 500k) with "amount left" message; Similar Books shows author-tier first then genre-tier, rating desc, max 8, correct links (verify on a Mira Voss/Rowan Hale book for the author tier); Add to Collection selects multiple + creates new + toasts; reviews list seeded entries, empty state on unseeded book, form submits + clears; home `/` and `/book` still work with extended `Book`; dark mode + keyboard focus.
