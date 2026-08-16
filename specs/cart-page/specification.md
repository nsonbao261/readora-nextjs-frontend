# Cart Page (`/cart`) — Specification

**Feature:** Cart (`/cart` route)
**Version:** 1.0
**Status:** Draft — awaiting confirmation

## 1. Feature Overview

Build the cart page at `/cart` — currently an "under construction" placeholder — into a working storefront cart. Users land here from the navbar cart icon (which already shows a live item-count badge) and can review the books they added, click an item to reopen its product page, change each line's quantity (increase/reduce), remove a line entirely, see the running subtotal, and either continue shopping or proceed to checkout.

The page is powered by the existing zustand `cart-store`, which already holds `CartItem { bookId, title, cover, price, quantity }` and the derived `selectSubtotal` / `selectCount` helpers. Cart state is in-memory only.

UI-only feature: everything runs against the in-repo cart store. There is no backend, real authentication, or live checkout; `/checkout` remains a placeholder.

## 2. Scope

### In Scope

- Line-item list of cart contents (cover, title, price, quantity); cover and title link back to the book's `/book/[slug]` page.
- Per-item controls: **Increase** quantity, **Reduce** quantity, **Delete** (remove line).
- **Total Price** line showing the items subtotal (price × quantity summed).
- **Checkout** button that is login-gated: guests get the login-gate dialog, signed-in users navigate to `/checkout`.
- **Continue Shopping** link back to the catalog.
- Empty-cart state with a call-to-action back to the catalog.
- New store actions for increasing/decreasing a line's quantity (the store currently only has `addItem` / `removeItem` / `clear`).

### Out of Scope

- Shipping fee / free-shipping threshold display on this page (total is items-subtotal only; shipping is out of scope here).
- Building `/checkout` itself (remains a placeholder; cart only navigates to it).
- Backend/API integration, real authentication, real payment.
- Persisting cart state across reloads (in-memory store only).
- Multiple carts, saved carts, or quantity limits set by real inventory/stock.
- Editing book metadata, applying coupons/discounts, taxes.
- CSS/styling details (handled in implementation, not this spec).

## 3. Functional Requirements

### 3.1 Item List

- **FR-1.1** The page reads cart items from the zustand `cart-store` and renders one row per line item showing the book cover, title, unit price (VND), quantity, and the line total (unit price × quantity).
- **FR-1.2** Line items are keyed by `bookId`; a book appears at most once per cart (quantities consolidate via `addItem`, not duplicated rows).
- **FR-1.3** Prices render in VND using the existing `formatPrice` helper (`src/lib/format.ts`).
- **FR-1.4** The cover image and title of each line item are links to the book's detail page (`/book/<bookId>`, matching the existing catalog linking convention) so users can revisit a product. Clicking a link does not modify the cart.

### 3.2 Quantity Controls (Increase / Reduce)

- **FR-2.1** **Increase** raises the line's quantity by 1 and re-renders the affected line total and the page total reactively.
- **FR-2.2** **Reduce** lowers the line's quantity by 1; a line cannot go below **1** — the reduce control is disabled at quantity 1.
- **FR-2.3** The cart store gains explicit quantity actions (e.g. `increaseQuantity` / `decreaseQuantity` by `bookId`) so the page does not abuse `addItem`/`removeItem` for these updates. Behavior stays consistent with the existing in-memory store (no persistence).
- **FR-2.4** Quantity changes have no confirmation dialog; they are immediate and reflected in the navbar count badge.

### 3.3 Delete

- **FR-3.1** **Delete** removes the entire line from the cart regardless of its quantity.
- **FR-3.2** A confirmation toast fires on removal (e.g. "Removed \"<title>\" from your cart").
- **FR-3.3** Removing the last line empties the cart and transitions the page to the empty state (3.5).

### 3.4 Total Price

- **FR-4.1** The page shows a **Total Price** line equal to the items subtotal: `Σ (unit price × quantity)` across all lines, using the store's `selectSubtotal` helper.
- **FR-4.2** The total updates reactively whenever a line is added, increased, reduced, or deleted.
- **FR-4.3** No shipping, tax, or discounts are added on this page (per confirmed scope; shipping is left to the checkout flow).

### 3.5 Empty State

- **FR-5.1** When the cart has no items, the page shows an empty-state message (e.g. "Your cart is empty") instead of the item list and total.
- **FR-5.2** The empty state includes a call-to-action that navigates to the catalog (`/book`).
- **FR-5.3** The total-price row and Checkout button are not shown in the empty state.

### 3.6 Checkout

- **FR-6.1** A **Checkout** button is shown with the cart summary (hidden when the cart is empty).
- **FR-6.2** The button is **login-gated**: signed-in users navigate to `/checkout`; guests are shown the existing `LoginGateDialog` (reused component) with a CTA to `/auth?mode=login`.
- **FR-6.3** Guests cannot reach `/checkout` via this button until they sign in. (Scope note: `/checkout` itself remains a placeholder and is not built here.)
- **FR-6.4** No sign-in is required to view, modify, or empty the cart — only to proceed to checkout.
- **FR-6.5** A **Continue Shopping** link is shown with the cart summary; it navigates to the catalog (`/book`) without clearing or modifying the cart. It is hidden in the empty state.

## 4. Data Model & Store

- **FR-7.1** Reuse the existing `CartItem` type (`{ bookId, title, cover, price, quantity }`) and the derived `selectSubtotal` / `selectCount` helpers in `src/stores/cart-store.ts` — no type changes required.
- **FR-7.2** Extend the cart store with quantity actions per FR-2.3 (`increaseQuantity` / `decreaseQuantity`). Existing `addItem` (increment-on-duplicate), `removeItem`, and `clear` are unchanged.
- **FR-7.3** Cart state remains in-memory and is not persisted across reloads.

## 5. State & Routes

- Route: `/cart` under the `(checkout)` route group (already exists; placeholder page).
- No URL search params on this page.
- State: `cart-store` (existing, extended with quantity actions) and `auth-store` (existing, for the checkout gate).
- The page is a client component (cart interactions are all client-side); the navbar cart badge stays wired to `selectCount` and needs no change.

## 6. Acceptance Criteria

1. `/cart` renders the cart item list (cover, title, unit price, quantity, line total) instead of the placeholder.
2. Clicking a line item's cover or title navigates to its `/book/<slug>` page without altering the cart.
3. **Increase** bumps a line's quantity and the total; **Reduce** lowers it and is disabled at quantity 1; **Delete** removes the line with a toast.
4. Quantity changes reflect immediately in the line total, page total, and navbar badge.
5. **Total Price** equals the items subtotal (Σ price × quantity) in VND and stays in sync with all quantity/remove operations.
6. **Continue Shopping** navigates to `/book` and leaves the cart untouched.
7. Empty cart shows the empty-state message with a working browse CTA; no list, total, Checkout button, or Continue Shopping link is rendered.
8. Guests clicking **Checkout** get the login-gate dialog (CTA → `/auth?mode=login`); signed-in users navigate to `/checkout`.
9. `npm run lint` and `npm run typecheck` pass.
