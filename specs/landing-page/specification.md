# Specification — Shared Components & Landing Page

## 1. Feature Overview
Readora currently has no site shell and a static placeholder home page. This feature introduces a reusable component layer — **Navbar**, **Footer**, **Book Card** — plus a contentful **Landing Page** (Hero Banner + featured books), and a **Zustand auth store** that drives login/logout-aware UI. It also renames the catalog route from `/catalog` to `/book`.

## 2. Goals
- Establish a site-wide layout shell (Navbar + Footer) in the root layout.
- Build a reusable Book Card showing ratings and a wishlist action.
- Build a marketing-focused landing page composed from shared components.
- Introduce client-side auth state with login/logout toggling (UI simulation).
- Align the URL structure with the new IA (`/book`, `/book/[id]`).

## 3. Scope

### In
- Site-wide Navbar (Home, Books) with auth-aware Account/Login UI
- Site-wide Footer
- Hero Banner (headline, subheadline, primary/secondary CTAs)
- Book Card (cover, title, author, genre, price, rating + count, wishlist button, links to detail)
- Landing page composition (Hero + featured books grid)
- Zustand auth store (`isAuthenticated`, login/logout actions, toggle)
- Wishlist gating: guest prompt → confirm → redirect to `/login`
- Route rename: `/catalog` → `/book`, `/product/[id]` → `/book/[id]`, update all internal links
- Mock book data module to power cards and the featured section

### Out
- About and Contact routes (links excluded from Navbar)
- Real authentication / backend / session
- Wishlist item persistence (add/remove/wishlist page behavior)
- Cart/checkout integration
- Product detail and catalog listing page redesigns (route change only)
- Detailed CSS styling work

## 4. Functional Requirements

**FR-1 — Auth state (Zustand)**
- Store tracks `isAuthenticated`, defaulting to logged-out.
- `login()` sets authenticated; `logout()` clears it. UI-only, no persistence required.
- A toggle control switches the Login/Logout UI in the Navbar.

**FR-2 — Navbar**
- Sticky top bar; brand links to Home.
- Links: Home (`/`), Books (`/book`).
- Logged out → "Log In" button (link to `/login`).
- Logged in → Account dropdown: Account (`/account`), Wishlist (`/wishlist`), Logout.
- Collapsible menu on mobile.

**FR-3 — Hero Banner**
- Top of landing page; headline, subheadline, and CTAs (primary → `/book`, secondary → existing page).
- Replaces the current placeholder hero.

**FR-4 — Book Card**
- Shows cover, title, author, genre, price, rating (stars + count).
- Wishlist button:
  - Logged in → toggles local wishlist state.
  - Logged out → prompts the user to log in; confirm redirects to `/login`, cancel does nothing.
- Card links to `/book/[id]`.

**FR-5 — Footer**
- Site-wide, consistent footer with brand blurb, link columns, and copyright; only links to existing routes.

**FR-6 — Landing Page**
- Hero Banner + "Featured books" section rendering Book Cards from mock data.
- CTAs point to `/book`.

**FR-7 — Routing & Navigation**
- Rename `/catalog` → `/book`; nest detail at `/book/[id]`.
- Update every internal reference to `/catalog` (home CTA, Navbar).
- Mount Navbar/Footer in the root layout so they render site-wide.
- No About/Contact links.

**FR-8 — Mock data**
- Book records: id, title, author, cover, genre, price (VND, whole dong), rating, rating count (feeds cards + featured section).

## 5. Non-Functional Requirements
- Reusable components placed in `components/layout`, `components/book`, `components/shared`.
- Accessible (keyboard nav, labels, focus) per shadcn/Base UI patterns.
- Responsive across breakpoints.
- Fits the existing stack: Next.js App Router, Tailwind v4 tokens, shadcn Base UI, Zustand, lucide-react.
- Dark-mode aware via existing theme tokens.

## 6. Dependencies & Constraints
- Existing shadcn primitives available: button, card, dropdown-menu, avatar, dialog, sheet.
- `font-heading` for display text; `next-themes` already wired.
- No backend — auth and wishlist are simulated client-side.

## 7. Assumptions
- Route group folder renamed to `book/`; detail nested under it.
- Wishlist prompt uses the existing Dialog primitive (implementation detail, resolved at plan stage).
- Prices are stored and formatted in VND (`vi-VN`, no decimals).
