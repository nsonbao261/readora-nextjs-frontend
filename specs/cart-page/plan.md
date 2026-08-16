# Plan — Cart Page (`/cart`)

## Design direction (from spec + existing tokens)

Keep the established cream / forest-green / Fraunces identity — no new palette. Two-column layout: **line-item list** on the left (cover-first rows, reusing the `aspect-[2/3] rounded-xl` cover language from `book-card`), **summary card** on the right (subtotal, total, Checkout, Continue Shopping). On mobile the columns stack. Empty cart shows a quiet message + browse CTA.

## Decisions (confirmed)

- Store: add `increaseQuantity(bookId)` / `decreaseQuantity(bookId)` to `src/stores/cart-store.ts` (spec FR-2.3); `decreaseQuantity` is a no-op at quantity 1 (FR-2.2, reduce control disabled). No new state shape; existing `addItem` / `removeItem` / `clear` and `selectSubtotal` / `selectCount` unchanged.
- New components under `src/components/cart/`:
  - `cart-line.tsx` (client) — cover + title link to `/book/[id]`, unit price, `Minus`/`Plus` icon buttons, line total, `Trash2` delete → `toast("Removed \"<title>\" from your cart")` (FR-3.2).
  - `cart-summary.tsx` (client) — items-subtotal, **Total Price** (VND via `formatPrice`), **Checkout** button (login-gated via existing `LoginGateDialog`; signed-in → `/checkout`), **Continue Shopping** link → `/book`.
  - `cart-empty.tsx` — empty-state message + CTA → `/book` (FR-5.1/5.2).
- Page: rewrite `src/app/(checkout)/cart/page.tsx` as a client component composing the three; reads `items` + `selectSubtotal` from `cart-store`, gates checkout with `selectIsAuthenticated` from `auth-store`.
- No new shadcn primitives needed (button, separator, dialog all exist). No new npm dependencies.

---

## Step-by-step implementation

### Step 1 — Store
- [x] Edit `src/stores/cart-store.ts`: add `increaseQuantity(bookId)` (bump `quantity` by 1) and `decreaseQuantity(bookId)` (lower by 1, clamped at a minimum of 1). Add comments per convention.

### Step 2 — Components
- [x] Create `src/components/cart/cart-line.tsx` (client): row with cover + title `Link` to `/book/[id]`, unit price, `Minus`/`Plus` icon buttons wired to the new store actions (minus disabled at quantity 1), line total (`price × quantity` via `formatPrice`), `Trash2` delete → `removeItem` + removal toast.
- [x] Create `src/components/cart/cart-summary.tsx` (client): subtotal from `selectSubtotal(items)`, **Total Price** line in VND, **Checkout** button (guest → `LoginGateDialog`; signed-in → `router.push("/checkout")`), **Continue Shopping** `Link` → `/book`. Hidden in empty state (rendered only when items exist).
- [x] Create `src/components/cart/cart-empty.tsx`: empty-state message + CTA → `/book`.

### Step 3 — Page rewrite
- [x] Rewrite `src/app/(checkout)/cart/page.tsx` (client): reads `items` from `cart-store`; empty → `CartEmpty`; otherwise two-column grid — item list (each `CartLine`) + `CartSummary`; header using `font-heading`.

### Step 4 — Verification
- [x] `npm run lint` · `npm run typecheck` · `npm run build` pass.
- [ ] Manual QA per spec Acceptance Criteria 1–9 (below).

---

## Critical files touched

| File | Action | Why |
|---|---|---|
| `src/stores/cart-store.ts` | Edit | Add `increaseQuantity` / `decreaseQuantity` (FR-2.3) |
| `src/app/(checkout)/cart/page.tsx` | Rewrite | Placeholder → working cart page (AC-1) |

## New components

| Component | Type | Purpose |
|---|---|---|
| `cart/cart-line.tsx` | client | Single line item: links, qty +/− controls, delete + toast |
| `cart/cart-summary.tsx` | client | Subtotal/total, login-gated Checkout, Continue Shopping |
| `cart/cart-empty.tsx` | client | Empty-state message + browse CTA |

## New routes / files

- `src/components/cart/cart-line.tsx`, `src/components/cart/cart-summary.tsx`, `src/components/cart/cart-empty.tsx` (new).

## New dependencies required

**None (npm).** `zustand`, `sonner`, `lucide-react`, `@base-ui/react` and all shadcn primitives (`button`, `dialog`, `separator`) are installed. No new shadcn components and no new npm packages are needed.

## Testing strategy

No test framework is configured, so:

- **Static**: `npm run lint`, `npm run typecheck`, `npm run build`.
- **Manual QA (per AC)**: `/cart` renders line items (cover, title, unit price, quantity, line total) instead of placeholder; cover/title navigate to `/book/[id]` without altering cart; increase/decease update line total, page total, and navbar badge reactively; minus disabled at quantity 1; delete removes line + toast, last delete → empty state; **Total Price** equals Σ price × quantity in VND; **Continue Shopping** → `/book` leaves cart untouched; empty cart shows message + CTA with no list/total/Checkout; guest Checkout → login-gate dialog (CTA → `/auth?mode=login`), signed-in → `/checkout`; dark mode + keyboard focus on all controls.
