# Plan — User Dashboard (`/account`)

## Design direction

Same cream / forest-green / Fraunces identity as the rest of the shop. Account pages share a two-column layout: a left section nav (Overview, Profile, Password, Collections, Wishlist, Addresses, Orders) that collapses into a horizontal scroll bar on mobile; each page opens with the small uppercase "Account" eyebrow + Fraunces heading used elsewhere. Forms are `max-w-2xl`, lists/grids span the content column, empty states reuse the dashed-border pattern from the catalog. No new palette.

## Decisions (confirmed + amendments)

- **Amendments to spec §2/FR-11.4** — two gaps found while reading the code:
  1. `collections-store` has no way to remove a single book, but FR-5.4 requires it. The store gains one **additive** action, `removeBookFromCollection(collectionId, bookId)` (non-breaking; "unchanged" otherwise).
  2. The `passwords` map is **module-private** in `auth-store.ts`, so `changePassword` must be added inside the store to reach it. Returns `boolean`; `false` for Google accounts and wrong current password.
- **Gating is client-side.** `(account)` pages are server shells; the shared layout renders a client `AccountShell` that reads `useAuthStore` and `useEffect`-redirects guests to `/auth?mode=login` (FR-1.3). A `Skeleton` renders while the effect runs.
- **`/account/collections/[slug]` and `/account/orders/[id]` resolve client-side** (collections live in zustand, orders in seed data); unknown ids render a not-found empty state.
- **Placeholder map** is a new local SVG `public/assets/map-placeholder.svg` (grid + pin); swap point marked with a comment.
- **Wishlist/addresses/orders stay in component state** seeded from `src/data/*`; the overview reads seed counts. Nothing persists across reloads.
- **Reuse:** `formatPrice`/`formatDate`, `SHIPPING_FEE`, `PASSWORD_REGEX`/`PHONE_REGEX`/`MIN_AGE`/`MAX_AGE`, `DatePickerField`, `FormField`, `BookCard`, existing dialogs/sheets. No new npm packages, no `npx shadcn add`.

---

## Step-by-step implementation

### Step 1 — Navbar (do this first, testable immediately)
- [x] Edit `src/components/shared/navbar.tsx`: in the signed-in **desktop dropdown** — Wishlist `href` `/wishlist` → `/account/wishlist`, add **Orders** → `/account/orders` (Account → `/account` already correct); mirror both changes in the **mobile sheet** links (FR-1.4).
- [x] Verify: no top-level `/wishlist` route is created; guest state unchanged (Log in button / cart badge). — confirmed via `grep` (no `href="/wishlist"` remains)

### Step 2 — Types
- [x] Create `src/types/address.ts`: `Address { id, recipientName, provinceCity, district, ward, street, isPrimary }` (FR-11.1).
- [x] Create `src/types/order.ts`: `OrderStatus`, `OrderItem`, `Order` per FR-11.2 (item snapshots title/cover/price/qty; `shippingAddress: Address`).
  - **Revision (approved):** `OrderStatus` is a **string enum** (not a union) so constants/components can reference `OrderStatus.Pending` etc.

### Step 3 — Constants
- [x] Create `src/constants/orders.ts`: `ORDER_STATUS_LABELS` (mapped `{ [K in OrderStatus]: string }`), `ORDER_STATUS_FLOW`, `CANCELLABLE_STATUSES` (FR-11.5, 9.2, 9.3). All reference `OrderStatus` enum members; no `Record`.

### Step 4 — Seed data + map asset
- [x] Create `src/data/addresses.ts`: 3 addresses for `usr-customer-1`, exactly one `isPrimary` (FR-7.1).
- [x] Create `src/data/wishlist.ts`: `wishlistBookIds: string[]` referencing `books` ids (FR-6.1).
- [x] Create `src/data/orders.ts`: 4–5 orders for `usr-customer-1` spanning **all** statuses (incl. one `pending` cancellable + one `cancelled`), newest-first, `subtotal`/`shippingFee`(`SHIPPING_FEE`)/`total` snapshots, item snapshots from real books (FR-8.1, 9.1). — 5 orders (`RD-1043`…`RD-1047`), `OrderStatus` enum used.
- [x] Create map asset — **moved to `public/assets/placeholder/map-placeholder.svg`** (user request); reference path `/assets/placeholder/map-placeholder.svg`; GMaps swap comment (FR-7.1).

### Step 5 — Stores
- [x] Edit `src/stores/auth-store.ts`: add `updateProfile(patch)` (updates `user` **and** matching `registeredUsers` entry — keeps navbar avatar in sync, FR-3.3) and `changePassword(current, next) → boolean` (validates against `passwords`; no-op for `provider !== "credentials"`, FR-4.3/4.4/4.5, 11.4).
- [x] Edit `src/stores/collections-store.ts`: add `removeBookFromCollection(collectionId, bookId)` (FR-5.4). No other changes.

### Verification for Steps 1–5
- [x] `npm run typecheck` passes (after clearing stale `.next` artifacts that referenced the deleted placeholder pages).
- [x] `npm run lint` passes. `npm run build` deferred to Step 14.

### Step 6 — Layout & guest gating
- [x] Create `src/app/(account)/layout.tsx` (server) → `<AccountShell>{children}</AccountShell>` (FR-1.1).
- [x] Create `src/components/account/account-shell.tsx` (client): null-user → `Skeleton` + effect redirect to `/auth?mode=login` (FR-1.3); 7-item section nav, active highlight via `usePathname` (FR-1.1); responsive rail/horizontal.
  - Nav: Overview/Profile/Password/Collections/Wishlist/Addresses/Orders; Overview exact-match only, others match descendants; `lg:grid-cols-[220px_1fr]` with sticky sidebar, mobile = horizontal scroll row. `typecheck` + `lint` pass.

### Step 7 — Account overview
- [x] Create `src/app/(account)/account/page.tsx` (server) → `<AccountOverview />`.
- [x] Create `src/components/account/account-overview.tsx` (client): "Welcome back, {firstName}" + summary cards (collections count/store, wishlist count/seed, addresses count/seed, 2–3 recent orders with status), each linking to its section (FR-2.1).
  - **Amendment (user-confirmed):** `status-badge.tsx` moved into Step 7 (overview needs it); Step 13 reuses it. Grid = 3 stat cards (collections/wishlist/addresses) + "Recent orders" panel. `typecheck` + `lint` pass.

### Step 8 — Profile management
- [x] Create `src/app/(account)/account/profile/page.tsx` (server) → `<ProfileForm />`.
- [x] Create `src/components/account/profile-form.tsx` (client): RHF + zod, prefilled from `auth-store.user`; Name (min 2), Email read-only, Phone (`PHONE_REGEX`), DOB via `DatePickerField`+`Controller` (18+); save → `updateProfile` + toast (FR-3.1–3.3).
  - Card `max-w-2xl`; DOB schema mirrors register-form; save button right-aligned. `typecheck` + `lint` pass.

### Step 9 — Password management
- [x] Create `src/app/(account)/account/password/page.tsx` (server) → `<PasswordForm />`.
- [x] Create `src/components/account/password-form.tsx` (client): current/new/confirm with visibility toggles; `PASSWORD_REGEX` + confirm refine; `changePassword` false → inline error; success → toast + reset; Google provider → `Alert` notice + disabled form (FR-4.1–4.5).
  - Fields wrapped in `fieldset disabled` for Google accounts; local `PasswordToggleButton` mirrors auth forms. `typecheck` + `lint` pass.

### Step 10 — Collections
- [x] Create `src/app/(account)/account/collections/page.tsx` (server) → `<CollectionsList />`.
- [x] Create `src/components/account/collections-list.tsx` (client): grid with cover thumbnails (from `bookIds`→`books`) + count; create (inline/dialog), rename (inline), delete (confirm); all toast; delete drops only the record (FR-5.1, 5.2, 5.5).
- [x] Create `src/app/(account)/account/collections/[slug]/page.tsx` (server) → `<CollectionDetail />` with slug prop.
- [x] Create `src/components/account/collection-detail.tsx` (client): resolve by id; `BookCard` grid + empty state; remove book → `removeBookFromCollection` + toast; rename/delete with delete → back to `/account/collections`; unknown slug → not-found empty state (FR-5.3, 5.4).
  - Collection cards = up to 3 cover thumbnails + name/count; empty covers show folder icon. Create uses a dialog; rename is inline (Enter to save); remove button renders under each `BookCard` (avoids touching shared component). `typecheck` + `lint` pass.

### Step 11 — Wishlist
- [x] Create `src/app/(account)/account/wishlist/page.tsx` (server) → `<WishlistSection />`.
- [x] Create `src/components/account/wishlist-section.tsx` (client): `BookCard` grid from `wishlistBookIds` → books, local `useState`; remove → toast; zero → empty state linking `/book` (FR-6.1–6.3).
  - Remove ghost button under each card (same pattern as collection detail); not synced with per-card `WishlistButton` (FR-6.3). `typecheck` + `lint` pass.

### Step 12 — Addresses
- [x] Create `src/app/(account)/account/addresses/page.tsx` (server) → `<AddressesSection />`.
- [x] Create `src/components/account/addresses-section.tsx` (client): cards with `/assets/map-placeholder.svg`, recipient, full address, Primary badge; create/edit via `Dialog` + RHF/zod (5 required fields); set-primary (exactly one); delete confirm (primary delete promotes first remaining); empty state; toasts (FR-7.1–7.6).
  - Local `useState` seeded from `src/data/addresses`; first created address auto-primaries; GMaps swap comment on the card image. `typecheck` + `lint` pass.

### Step 13 — Order history + detail
- [x] Create `src/app/(account)/account/orders/page.tsx` (server) → `<OrdersList />`.
- [x] Create `src/components/account/orders-list.tsx` (client): rows with id, `formatDate(placedAt)`, item count, `formatPrice(total)`, status badge; newest-first; empty state (FR-8.1, 8.2).
- [x] Create `src/components/account/status-badge.tsx` (client): `OrderStatus` → `Badge` variant mapping (list, overview, detail; `cancelled` → destructive). — **created in Step 7** (overview needs it; Step 13 reuses it).
- [x] Create `src/app/(account)/account/orders/[id]/page.tsx` (server) → `<OrderDetail />` with id prop.
- [x] Create `src/components/account/order-detail.tsx` (client): line items (cover/title/price/qty), address snapshot, subtotal/shipping/total, placed date; status timeline (`ORDER_STATUS_FLOW`, current marked, distinct cancelled); Cancel only when status ∈ `CANCELLABLE_STATUSES` → confirm dialog → `cancelled` + toast, then hidden (FR-9.1–9.4, 10.1).
  - Timeline is vertical (dot + connecting line, current step labelled); detail = 2-col `1fr + 280px` (items/timeline left, summary/address/cancel right). Local state seeded from `src/data/orders` per page (list & detail not cross-synced — matches "component state" decision). `typecheck` + `lint` pass.

### Step 14 — Verification
- [x] `npm run lint`, `npm run typecheck`, `npm run build`; manual QA below.
  - All three pass; build registers `/account`, `/account/addresses`, `/account/collections`, `/account/collections/[slug]` (dynamic), `/account/orders`, `/account/orders/[id]` (dynamic), `/account/password`, `/account/profile`, `/account/wishlist`. No top-level `/wishlist` route (Step 1 confirmed via grep).

---

## New components / pages for testing

| Route / component | What to test |
|---|---|
| `navbar.tsx` (Step 1) | Signed-in dropdown + mobile sheet: Account → `/account`, Wishlist → `/account/wishlist`, **Orders → `/account/orders`**; no stale `/wishlist` links; guests unaffected |
| `/account` → `account-overview.tsx` | Greeting by name; 4 summary cards with correct counts + section links |
| `/account/profile` → `profile-form.tsx` | Prefilled fields; email disabled; inline validation; save → toast + navbar avatar updates |
| `/account/password` → `password-form.tsx` | Wrong current → inline error; valid change → toast + old password rejected at login; Google account → notice + disabled form |
| `/account/collections` → `collections-list.tsx` | Seeded collections render w/ counts; create/rename/delete with toasts |
| `/account/collections/[slug]` → `collection-detail.tsx` | Book grid; remove-from-collection toast; rename/delete; delete returns to list; unknown slug → empty state |
| `/account/wishlist` → `wishlist-section.tsx` | Seeded grid; remove → toast; last item → empty state → `/book` |
| `/account/addresses` → `addresses-section.tsx` | Cards w/ placeholder map + Primary badge; create/edit validate 5 fields; set-primary keeps exactly one; delete confirms + promotes on primary delete; empty state |
| `/account/orders` → `orders-list.tsx` | Newest-first rows: id, date, count, total, status badge; empty state |
| `/account/orders/[id]` → `order-detail.tsx` + `status-badge.tsx` | Items/totals/address/timeline; cancelled timeline state; cancel only pre-shipment → confirm → status flips + button disappears |
| Guest gating (all) | Any `/account/*` while signed out → `/auth?mode=login` |

## Critical files touched

| File | Action | Why |
|---|---|---|
| `src/components/shared/navbar.tsx` | Edit | Retarget Wishlist + add Orders (FR-1.4) |
| `src/stores/auth-store.ts` | Edit | Add `updateProfile` + `changePassword` (FR-3.3, 4.4; needs private `passwords` map) |
| `src/stores/collections-store.ts` | Edit | Add `removeBookFromCollection` (FR-5.4) |

## New routes / files

- Pages: `(account)/layout.tsx`, `(account)/account/page.tsx`, `.../profile`, `.../password`, `.../collections`, `.../collections/[slug]`, `.../wishlist`, `.../addresses`, `.../orders`, `.../orders/[id]`.
- Types: `src/types/address.ts`, `src/types/order.ts`. Seeds: `src/data/addresses.ts`, `src/data/wishlist.ts`, `src/data/orders.ts`. Constants: `src/constants/orders.ts`. Asset: `public/assets/map-placeholder.svg`.

## New dependencies required

**None.** All packages + shadcn primitives already installed; no `npx shadcn add`.

## Testing strategy

No test framework configured, so:

- **Static:** `npm run lint`, `npm run typecheck`, `npm run build`.
- **Manual QA:** the per-component checklist above + regression: `/`, `/book`, `/auth`, dark mode + keyboard focus; confirm changes to navbar/stores are additive (no behavior change for guests/cart).
