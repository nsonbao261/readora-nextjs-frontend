# Book Detail Page (`/book/[slug]`) — Specification

**Feature:** Book Detail (`/book/[slug]` route)
**Version:** 1.0
**Status:** Confirmed

## 1. Feature Overview

Build the book detail page at `/book/[slug]` — currently an "under construction" placeholder — into a full storefront product page. Users land here from the catalog, featured grid, or "similar books" links and can: read the book's info and reviews, see shipping cost, add the book to the cart, buy it now, save it to a wishlist or a personal collection, and (when signed in) post their own rating and review.

UI-only feature: everything runs against in-repo mock data and zustand stores. There is no backend, real authentication, or live checkout.

## 2. Scope

### In Scope

- Detail page at `/book/[slug]` (rename existing `/book/[id]` segment; ids in mock data are already slugs, so URLs stay unchanged).
- Book info: cover, title, author, genres, badges, aggregate rating + count, published date, description, price (with sale/original price).
- **Buy Now** — adds the book to the cart and navigates to `/checkout`.
- **Add to Cart** — adds the book to a new zustand cart store with a confirmation toast.
- **Wishlist** — reuse the auth-gated wishlist toggle (guests get a "log in" dialog).
- **Shipping fee** — flat fee shown on the page, with free-shipping-over-threshold logic.
- **Similar Books** — same-author first, then same-genre, sorted by top rating, up to 8, linking to other detail pages.
- **Add to Collection** — auth-gated; signed-in users pick one or more of their collections (or create a new one) via a sheet/dialog; guests see the login gate.
- **Ratings & Reviews** — seeded mock reviews per book (author, rating, date, content); signed-in users can rate + write a review via an auth-gated form.
- Extend `Book` with a `description` field; add a `Review` type and `src/data/reviews.ts`.

### Out of Scope

- Backend/API integration, real authentication, real checkout/payment.
- Building the `/cart`, `/checkout` pages themselves (remain placeholders).
- Persisting user-submitted ratings/reviews across reloads (static mock only).
- Editing/deleting collections, reordering, collection detail pages.
- Multiple shipping options or real shipping calculation.
- CSS/styling details (handled in implementation, not this spec).

## 3. Functional Requirements

### 3.1 Route & Book Info

- **FR-1.1** Route is `/book/[slug]` (dynamic segment renamed from `[id]`). Existing links (`BookCard`, featured sections) keep working because mock ids are already slugs.
- **FR-1.2** The page looks up the book by slug in mock data; an unknown slug renders the app's 404 (not-found) response.
- **FR-1.3** Book info shows: cover, title, author, genre(s), badges (New Release / Bestseller / On Sale), aggregate rating + rating count, published date, and synopsis (`description`).
- **FR-1.4** Price is shown in VND; discounted books also display the original price and an On Sale indicator.

### 3.2 Buy Now

- **FR-2.1** **Buy Now** adds the book to the cart store, then navigates to `/checkout`.
- **FR-2.2** The action requires no sign-in (guest checkout is assumed for this UI-only feature).

### 3.3 Add to Cart

- **FR-3.1** **Add to Cart** adds the book (id, title, cover, price) to a zustand `cart-store` and fires a success toast.
- **FR-3.2** Adding a book that is already in the cart increments its quantity rather than duplicating the line item.
- **FR-3.3** Cart state is in-memory (UI-only); it is not persisted across reloads yet.

### 3.4 Wishlist

- **FR-4.1** The wishlist toggle requires authentication. Guests get a "Log in to save books" dialog with a link to `/login`.
- **FR-4.2** Signed-in users can toggle the book on/off the wishlist, with a toast confirming add/remove. (UI-only, local state.)

### 3.5 Shipping Fee

- **FR-5.1** A flat shipping fee is displayed for the single item, read from a constant.
- **FR-5.2** Free shipping applies when the order subtotal meets a threshold (also a constant). The page reflects whether the current book's price qualifies and shows the remaining amount needed for free shipping when it does not.
- **FR-5.3** All shipping constants live in `src/constants/` (e.g. `src/constants/shipping.ts`), imported by the detail page and reusable by cart/checkout later.

### 3.6 Similar Books

- **FR-6.1** Up to 8 books, ranked: books by the **same author** first, then books sharing at least one **genre** with the current book; ties broken by **rating (desc)**.
- **FR-6.2** Each card links to its own `/book/[slug]` page and reuses the existing `BookCard` component.
- **FR-6.3** If fewer than 8 matches exist, show only the matches; if none exist, the section is hidden.

### 3.7 Add to Collection

- **FR-7.1** Auth-gated: guests who click **Add to Collection** see the login-gate dialog (link to `/login`).
- **FR-7.2** Signed-in users open a sheet/dialog listing their collections (from a zustand `collections-store`), each with a checkbox, plus a "Create new collection" input.
- **FR-7.3** Saving adds the current book to the selected collection(s) and fires a confirmation toast. Multiple collections are supported (user has several collections; a book can live in more than one).
- **FR-7.4** A couple of seeded collections exist so the flow is demonstrable out of the box. Collections are in-memory (UI-only).

### 3.8 Ratings & Reviews

- **FR-8.1** A Reviews section lists seeded reviews for the book (reviewer name, star rating, date, and content). Reviews come from `src/data/reviews.ts`, keyed by book slug.
- **FR-8.2** The section shows the aggregate rating and count as the header summary.
- **FR-8.3** **Rate + Review** is auth-gated: guests see the login-gate dialog.
- **FR-8.4** Signed-in users can pick a star rating and write a review; submitting fires a confirmation toast. Submissions are not persisted (static mock only) and do not change the aggregate rating.
- **FR-8.5** A review form is disabled/cleared appropriately after submit to avoid duplicate submission.

## 4. Data Model

- **FR-9.1** Extend `Book` with `description: string`; seed it for existing mock books.
- **FR-9.2** New type `Review`: `{ id, bookId, userName, rating, date, content }`.
- **FR-9.3** New `src/data/reviews.ts` seeds a small set of reviews (3–5) for at least the primary mock books.
- **FR-9.4** New `src/stores/cart-store.ts` — cart items `{ bookId, title, cover, price, quantity }`, actions to add/increment and total/subtotal derived state.
- **FR-9.5** New `src/stores/collections-store.ts` — collections `{ id, name, bookIds }`, actions to add a book and create a collection; seeded with 2–3 default collections.
- **FR-9.6** New folder `src/constants/` for shipping fee + free-shipping threshold (and any other shared constants the feature needs, e.g. similar-books max count).

## 5. State & Routes

- Route: `/book/[slug]` under `(catalog)`; unknown slug → not-found.
- No URL search params on this page.
- In-memory stores: `auth-store` (existing), `cart-store` (new), `collections-store` (new). Nothing persists across reloads.
- Server component renders book info + similar books; client components handle cart/wishlist/collection/review interactions.

## 6. Acceptance Criteria

1. `/book/<slug>` for any seeded book renders full book info instead of the placeholder; unknown slugs return 404.
2. **Add to Cart** adds/increments in the cart store with a toast; **Buy Now** adds then navigates to `/checkout`.
3. Wishlist requires auth (guest → login dialog); signed-in toggling works with toasts.
4. Shipping fee and free-shipping-over-threshold are shown correctly, including the "amount left" message when applicable.
5. Similar Books shows same-author-then-genre matches sorted by rating desc (max 8), each linking correctly.
6. Add to Collection is auth-gated; signed-in users can select multiple collections or create a new one and get a confirmation toast.
7. Reviews list seeded reviews with author/rating/date; rate + review is auth-gated and submits with a toast.
8. Existing links from the catalog and home page to book pages keep working after the `[id]` → `[slug]` rename.
9. `npm run lint` and `npx tsc --noEmit` pass.
