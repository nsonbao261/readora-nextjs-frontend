# User Dashboard (`/account`) — Specification

**Feature:** User Dashboard (Profile, Password, Collections, Wishlist, Addresses, Orders)
**Version:** 1.0
**Status:** Confirmed

## 1. Feature Overview

Build the user dashboard, replacing the placeholder `/account` area with a full account management hub for signed-in customers. All routes live under `/account` in the `(account)` route group, sharing a layout with a section nav.

Users can manage their personal information and password, view/create/rename/delete their book **collections**, view and prune their **wishlist**, manage multiple shipping **addresses** (one primary), and review their **order history** with per-order progress tracking and cancellation.

The feature is **UI-only**, matching the repo pattern: no backend. Data comes from **seed data files** plus the existing in-memory stores; every mutating action gives feedback via **sonner toasts**. No new zustand store is created — the existing `auth-store` is extended (profile + password) and `collections-store` is reused. Google Maps is **not** integrated; address cards show a **placeholder map image** to be replaced later.

## 2. Scope

### In Scope

- Shared `(account)` layout with section navigation (overview, profile, password, collections, wishlist, addresses, orders), active-section highlighting, and guest gating.
- **Account overview** at `/account`: greeting + summary cards + quick links.
- **Profile management** at `/account/profile`: edit name, phone, date of birth; email read-only.
- **Password management** at `/account/password`: change password (current → new → confirm) with validation against the in-memory credentials.
- **Collections** at `/account/collections` and `/account/collections/[slug]`: view all, create, rename, delete; per-collection book grid with remove-from-collection.
- **Wishlist** at `/account/wishlist`: view seeded wishlist books, remove items, empty state.
- **Addresses** at `/account/addresses`: list with placeholder map image, create, edit, delete, set primary.
- **Order history** at `/account/orders`: list of seeded orders (status badge, date, totals, item count).
- **Order detail/tracking** at `/account/orders/[id]`: items, shipping address, totals, status timeline, cancel (when cancellable).
- Extend `auth-store` with `updateProfile` and `changePassword`; reuse `collections-store` unchanged.
- Update the Navbar account menu to point at `/account/*` (no top-level `/wishlist`).
- New seed data files: addresses, orders, wishlist.
- New types: `Address`, `Order`, `OrderItem`, `OrderStatus`.
- Sonner toasts for every successful/failed mutation; login-gate/redirect for guests.

### Out of Scope

- Backend/API integration and persistence (in-memory + seed data only).
- Google Maps integration (placeholder image only), geocoding, or address autocomplete.
- Real password hashing/reset emails; password changes only update the in-memory credential map.
- Unifying the dashboard wishlist with the per-card `WishlistButton` local state (they stay separate; the dashboard removes from its own seeded list).
- Admin dashboards, order management, and anything role-admin-specific.
- Reviews, ratings, or "re-order" actions from order history.
- CSS/styling details (handled in implementation, not this spec).

## 3. Functional Requirements

### 3.1 Layout, Routes & Gating

- **FR-1.1** A shared `(account)` layout renders a section nav (Overview, Profile, Password, Collections, Wishlist, Addresses, Orders) beside the page content; the active section is highlighted.
- **FR-1.2** Routes: `/account`, `/account/profile`, `/account/password`, `/account/collections`, `/account/collections/[slug]`, `/account/wishlist`, `/account/addresses`, `/account/orders`, `/account/orders/[id]`.
- **FR-1.3** Signed-out visitors to any `/account/*` page are redirected to `/auth?mode=login`.
- **FR-1.4** The Navbar account dropdown is updated: **Account** → `/account`, **Wishlist** → `/account/wishlist`, plus a new **Orders** → `/account/orders`. The top-level `/wishlist` route is not created.

### 3.2 Account Overview

- **FR-2.1** `/account` greets the signed-in user by name and shows summary cards: number of collections, wishlist items, saved addresses, and most recent orders (with status), each linking to its section.

### 3.3 Profile Management

- **FR-3.1** `/account/profile` shows a form pre-filled from the signed-in `auth-store` user: **Name**, **Email** (read-only), **Phone**, **Date of birth** (dd/mm/yyyy).
- **FR-3.2** Validation (inline errors): name required/min 2 chars; phone required and VN mobile format (reuse existing regex constant); DOB a valid date and an adult (18+, same rule as registration).
- **FR-3.3** Save calls `auth-store.updateProfile`, fires a confirmation toast, and reflects changes in the navbar avatar.

### 3.4 Password Management

- **FR-4.1** `/account/password` shows **Current password**, **New password**, **Confirm new password** (with visibility toggles).
- **FR-4.2** New password follows the existing policy (min 8 chars, at least one letter and one number); confirm must match.
- **FR-4.3** A wrong current password shows an inline error (no account lockout).
- **FR-4.4** Success updates the in-memory credential map (`auth-store.changePassword`) and fires a toast.
- **FR-4.5** Google-provider accounts have no stored password; the section shows a notice and disables the form.

### 3.5 Collections

- **FR-5.1** `/account/collections` lists all collections (from `collections-store`) with book count and cover thumbnails; seeded collections appear out of the box.
- **FR-5.2** **Create** a collection via an inline input/dialog (non-blank name); **rename** (inline); **delete** (confirm dialog). All fire toasts.
- **FR-5.3** Clicking a collection opens `/account/collections/[slug]` (slug = collection id; seeded ids already act as slugs, e.g. `to-read`, `favorites`, `gift-ideas`, and created collections get uuid slugs) showing its books in a grid (reusing `BookCard`) and an empty state.
- **FR-5.4** On the detail page a book can be **removed** from the collection (toast, persists to store), and the collection can be renamed or deleted (delete returns to the collections list).
- **FR-5.5** Deleting a collection only removes the collection record — books are untouched.

### 3.6 Wishlist

- **FR-6.1** `/account/wishlist` lists the seeded wishlist books (grid using `BookCard`) for the demo customer.
- **FR-6.2** Each item can be **removed** (toast); removing the last item shows an empty state with a link back to the catalog.
- **FR-6.3** The dashboard wishlist is driven by seed data + local state and is not synced with the per-card `WishlistButton`.

### 3.7 Addresses

- **FR-7.1** `/account/addresses` lists all saved addresses; each card shows a **placeholder map image** (to be replaced by Google Maps later), recipient name, full address, and a **Primary** badge on the primary address.
- **FR-7.2** Address fields: **Recipient name**, **Province/City**, **District**, **Ward/Commune**, **Street address**.
- **FR-7.3** **Create** and **edit** addresses via a form (dialog/sheet) with required-field validation; saving fires a toast.
- **FR-7.4** **Set as primary** re-marks the primary flag; exactly one address is primary at a time.
- **FR-7.5** **Delete** requires confirmation; deleting the primary promotes another address to primary; deleting the last address shows an empty state.
- **FR-7.6** No limit on address count is enforced (Google Maps validation later).

### 3.8 Order History

- **FR-8.1** `/account/orders` lists seeded orders newest-first, each showing order ID, placed date, item count, total (VND), and a status badge.
- **FR-8.2** Clicking an order opens `/account/orders/[id]`; empty history shows an empty state.

### 3.9 Order Detail, Tracking & Cancellation

- **FR-9.1** `/account/orders/[id]` shows the order's line items (cover, title, price, qty), shipping address snapshot, subtotal/shipping/total (reusing `formatPrice` and the shipping fee constant), and placed date.
- **FR-9.2** A **status timeline** shows the progress: `pending → processing → shipped → delivered`, with the current step marked; cancelled orders show a distinct cancelled state.
- **FR-9.3** **Cancel order** is available only while the status is `pending` or `processing` (pre-shipment); a confirm dialog precedes cancellation.
- **FR-9.4** Cancelling updates the order status to `cancelled` (local state + toast) and removes the cancel action thereafter.

### 3.10 Feedback

- **FR-10.1** Every mutating action (profile save, password change, collection create/rename/delete, wishlist remove, address create/edit/delete/set-primary, order cancel) fires a sonner toast.

## 4. Data Model

- **FR-11.1** New `src/types/address.ts`: `Address { id, recipientName, provinceCity, district, ward, street, isPrimary }`.
- **FR-11.2** New `src/types/order.ts`: `OrderStatus` (`pending | processing | shipped | delivered | cancelled`), `OrderItem { bookId, title, cover, price, quantity }`, `Order { id, placedAt (ISO), items: OrderItem[], subtotal, shippingFee, total, status, shippingAddress: Address snapshot }`.
- **FR-11.3** New seed files: `src/data/addresses.ts` (2–3 addresses, one primary for the demo customer), `src/data/orders.ts` (several orders spanning all statuses, incl. one cancellable), `src/data/wishlist.ts` (book ids referencing `src/data/books.ts`).
- **FR-11.4** `auth-store` extended with `updateProfile(patch)` (name/phone/dob) and `changePassword(current, next) → boolean` (validates against the in-memory credential map; no-op for Google accounts). `collections-store` and `cart-store` unchanged.
- **FR-11.5** New constants: order status labels + cancellable statuses (e.g. `src/constants/orders.ts`).
- **FR-11.6** No new dependencies — `react-hook-form`, `zod`, `@hookform/resolvers`, `date-fns`, `sonner`, and existing shadcn/Base UI components are reused.

## 5. State & Routes

- Routes: `/account` and subsections listed in FR-1.2, all under the `(account)` route group with a shared client layout.
- Store changes: `auth-store` gains `updateProfile` + `changePassword`; collections/wishlist/addresses/orders are seed data + local component state. Nothing persists across reloads.
- Server pages render shells; client components hold forms/lists and read from seed data + stores.

## 6. Acceptance Criteria

1. Signed-out users hitting any `/account/*` route are redirected to `/auth?mode=login`; signed-in users land on the dashboard.
2. The section nav is present on all `/account/*` pages and highlights the active section.
3. `/account` shows the user greeting and working summary cards.
4. Profile edits persist to `auth-store`, validate inline, and update the navbar avatar; email is read-only.
5. Password change validates the current password, enforces the password policy, updates the in-memory map, and is disabled for Google accounts.
6. Collections can be listed, created, renamed, and deleted (with confirm); collection detail (`/account/collections/[slug]`) shows books and supports remove-from-collection.
7. Wishlist items can be removed with toasts and an empty state appears at zero items.
8. Addresses support create, edit, delete (confirm), and set-as-primary with exactly one primary; every card shows the placeholder map image.
9. Order history lists seeded orders; order detail shows items, totals, address snapshot, and a status timeline.
10. Cancellation is offered only pre-shipment, requires confirmation, updates status to `cancelled`, and shows the cancelled timeline state.
11. `npm run lint` and `npm run typecheck` pass.

## 7. Recommended Extensions (future, out of scope now)

- Real Google Maps embed + geocoding/address autocomplete for the address cards.
- Unified wishlist store shared with the per-card `WishlistButton`.
- Order creation flow from the checkout, and re-order / review-after-delivery actions.
- Route guards and role-based access for `/account` vs `/admin`.
- Persistence (localStorage/cookies) and real backend integration.
