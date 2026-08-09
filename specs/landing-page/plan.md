# Plan — Shared Components & Landing Page

## Design direction (from spec + existing tokens)

Keep the established cream / forest-green / Fraunces identity — no new palette. The **signature** is the book cover itself: the hero opens with a fanned/staggered strip of real covers from `public/assets/books/` as the visual anchor behind the headline, then the featured grid carries the same cover-first language. Everything stays quiet around that.

## Decisions (confirmed)

- Auth toggle: subtle icon button in Navbar (only way to preview logged-in state since `/login` is a placeholder).
- Featured grid: 6 books from mock data.
- Route rename: keep `(catalog)` route group; rename inner folder `catalog/` → `book/` and `product/[id]/` → `book/[id]/`.
- Wishlist feedback: `sonner` toasts (already installed).
- Hero banner path: `src/components/landing/hero-banner.tsx`.
- Prices: mock data stores whole VND amounts; `formatPrice` renders via `Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })` (e.g. 189000 → "189.000 ₫").

---

## Step-by-step implementation

### Step 1 — Types & mock data
- [x] Create `src/types/book.ts` — `Book` type: `id`, `title`, `author`, `cover`, `genre`, `price`, `rating`, `ratingCount`.
- [x] Create `src/data/books.ts` — mock array of 8 books (enough to power the 6-card featured grid) referencing existing covers with **correct casing** (`/assets/books/Book1.png`, `book2.png`, `Book3.png`, …).
  - Note: on user request, all 17 cover files were normalized to lowercase `book1–17.png` (renamed `Book1`, `Book3–Book8`). Data references `/assets/books/bookN.png`.
  - Note: on user request, prices were converted from USD-like decimals to whole VND amounts (e.g. `189000`) — see Step 3's `formatPrice`.

### Step 2 — Zustand auth store
- [x] Create `src/stores/auth-store.ts` — `isAuthenticated: boolean` (default `false`), `login()`, `logout()`, `toggle()`. No persistence (per spec).

### Step 3 — Book components
- [x] Create `src/components/book/rating.tsx` — server component: star row (lucide `Star`) + numeric count from `rating`/`ratingCount`.
- [x] Create `src/components/book/wishlist-button.tsx` — client component: local `useState` wishlist toggle; if logged out, opens the shadcn `Dialog` prompt ("Log in to save…") with Cancel / Log in → `router.push("/login")`; on add → `toast.success("Added to your wishlist")`, on remove → `toast("Removed from your wishlist")`.
  - Note: takes only `bookTitle` for now — `bookId` was dropped (unused, lint warning). Reintroduce it when wishlist persistence is added.
- [x] Create `src/components/book/book-card.tsx` — cover-first card built on shadcn `Card` primitives (title, author, genre, price formatted in VND, `Rating`, `WishlistButton`), cover + title link to `/book/[id]`.

### Step 4 — Layout shell
- [ ] Create `src/components/layout/navbar.tsx` — client component: sticky bar; brand → `/`; links Home + Books (`/book`); auth-aware right side (logged out → "Log In" button → `/login`; logged in → `DropdownMenu` with Account, Wishlist, Logout); subtle icon toggle button to flip `isAuthenticated`; mobile menu via `Sheet`.
- [ ] Create `src/components/layout/footer.tsx` — server component: brand blurb, link columns (Books, Account, Wishlist, Cart, Login — only existing routes), copyright. No About/Contact.

### Step 5 — Landing page
- [ ] Create `src/components/landing/hero-banner.tsx` — server component: eyebrow + Fraunces headline + subheadline; primary CTA (Button rendered as `Link` → `/book`) and secondary CTA (→ `/collections`); signature cover-strip visual.
- [ ] Rewrite `src/app/(public)/page.tsx` — server component composing `<HeroBanner />` + "Featured books" section rendering **6** `BookCard`s from mock data.

### Step 6 — Mount the shell
- [ ] Edit `src/app/layout.tsx` — wrap `{children}` in `<main className="flex-1">` between `<Navbar />` and `<Footer />` so the footer sits at the bottom site-wide; mount `<Toaster />`.
- [ ] Create `src/components/shared/toaster.tsx` — client wrapper reading `useTheme` from `next-themes`, rendering `<Toaster theme={resolvedTheme} />` (dark-mode aware).

### Step 7 — Route rename (`/catalog` → `/book`)
- [ ] `git mv src/app/(catalog)/catalog/page.tsx src/app/(catalog)/book/page.tsx`
- [ ] `git mv "src/app/(catalog)/product/[id]/page.tsx" "src/app/(catalog)/book/[id]/page.tsx"` (keep `(catalog)` group)
- [ ] Update any remaining `/catalog` references (the only one today is in the placeholder home page, which Step 5 replaces; Navbar will link `/book`).

### Step 8 — Verification
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build`
- [ ] Manual QA (below)

---

## Critical files touched

| File | Action | Why |
|---|---|---|
| `src/app/layout.tsx` | Edit | Mount Navbar/Footer in the only site-wide layout + `Toaster` |
| `src/app/(public)/page.tsx` | Rewrite | Replace placeholder hero with landing page |
| `src/app/(catalog)/catalog/page.tsx` | Move | Becomes `/book` (placeholder kept) |
| `src/app/(catalog)/product/[id]/page.tsx` | Move | Becomes `/book/[id]` (placeholder kept) |

## New components

| Component | Type | Purpose |
|---|---|---|
| `layout/navbar.tsx` | client | Sticky site nav, auth-aware Account/Login UI, mobile sheet |
| `layout/footer.tsx` | server | Site-wide footer, existing-route links only |
| `book/book-card.tsx` | server | Reusable cover-first book card → `/book/[id]` |
| `book/rating.tsx` | server | Star rating + count display |
| `book/wishlist-button.tsx` | client | Wishlist toggle + guest login-gate Dialog + sonner toast |
| `landing/hero-banner.tsx` | server | Landing hero with CTAs + signature cover strip |
| `shared/toaster.tsx` | client | Theme-aware sonner `Toaster` mounted in root layout |

## New routes / files

- `src/app/(catalog)/book/page.tsx` and `src/app/(catalog)/book/[id]/page.tsx` (moves)
- `src/stores/auth-store.ts`, `src/types/book.ts`, `src/data/books.ts` (new modules)

## New dependencies required

- **None.** `zustand`, `lucide-react`, `@base-ui/react`, `sonner`, and all shadcn primitives (`button`, `card`, `dropdown-menu`, `dialog`, `sheet`) are already installed.

## Testing strategy

No test framework is configured, so:

- **Static**: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- **Manual QA checklist**: navbar sticky + mobile sheet toggle; auth toggle flips Log In ↔ Account dropdown; logout works; wishlist gating (guest → Dialog → confirm → `/login`, cancel → stays); wishlist toasts fire on add/remove; card links navigate to `/book/[id]`; `/catalog` → `/book` navigation; dark mode + keyboard focus on all interactive elements; footer links resolve to existing pages.
