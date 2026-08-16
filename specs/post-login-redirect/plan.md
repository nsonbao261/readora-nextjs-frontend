# Plan — Post-Login Redirect

## Design direction

No visual changes. The feature only changes where users land after auth. The existing `redirect` param mechanism (already threaded through `/auth` → forms → `resolveRedirect`) is reused; entry points that currently drop the "current page" context start passing it as the `redirect` target. Admins keep the existing `/admin` override (`resolveRedirect` is unchanged in behavior for admins).

## Decisions (confirmed)

- **Entry points, not the auth flow.** `login-form`, `register-form`, `google-button`, `email-verification`, `auth-view`, and `/auth` need zero changes — they already consume and propagate `redirect`. The fix lives in the callers that send guests to `/auth` without a redirect param.
- **`window.location` read at interaction time** for click/effect-based entry points (`wishlist-button`, `login-gate-dialog`, `account-shell`). This avoids `useSearchParams` + Suspense complications on server-rendered pages (catalog, book detail).
- **New `AuthLink` client component** for navbar/footer static `<Link>`s. First render uses the plain `/auth?mode=…` href (SSR-safe); a `useEffect` swaps in the current page as the redirect target after mount. This keeps navbar/footer markup and styling intact while preserving path + query.
- **Admin behavior unchanged** — `resolveRedirect` still returns `/admin` for admins (user confirmed).
- **Open-redirect guard** — `resolveRedirect` only trusts `redirect` values that start with `/` and not `//`; otherwise falls back to `DEFAULT_REDIRECT`.
- **No new dependencies** — everything used (`next/navigation`, `lucide-react`, zustand) is already installed.

---

## Step-by-step implementation

### Step 1 — Helper + guard (`src/components/auth/auth-utils.ts`)
- [x] Add `authHrefFromCurrent(mode, pathname, search)` → `authHref(mode, `${pathname}${search}`)`.
- [x] Harden `resolveRedirect`: accept `redirectParam` only if it starts with `/` and not `//`, else `DEFAULT_REDIRECT`. Admin branch unchanged.
- [x] Update `src/components/auth/auth-utils.ts` doc comments.

### Step 2 — New `AuthLink` component (`src/components/auth/auth-link.tsx`)
- [x] New client component: renders `<Link>`; initial `href` = `authHref(mode)`; `useEffect` reads `window.location.pathname` + `.search`, sets `href` = `authHrefFromCurrent(mode, pathname, search)`.
- [x] Props: `mode: AuthMode`, `className?`, `children`; passes through `Link` styling.

### Step 3 — Click/effect entry points
- [x] `src/components/book/wishlist-button.tsx`: "Log in" button pushes `authHrefFromCurrent("login", pathname, search)` from `window.location`.
- [x] `src/components/shared/login-gate-dialog.tsx`: same change on its CTA button.
- [x] `src/components/account/account-shell.tsx`: guest effect replaces with `authHrefFromCurrent("login", pathname, search)` from `window.location`.

### Step 4 — Navbar + Footer links
- [x] `src/components/shared/navbar.tsx`: replace desktop + mobile sheet `<Link href="/auth?mode=login">` with `<AuthLink mode="login">`.
- [x] `src/components/shared/footer.tsx`: "Log in" → `<AuthLink mode="login">`, "Create an account" → `<AuthLink mode="register">`.

### Step 5 — Verification
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] Grep sweep: no entry point still hardcodes `/auth?mode=…` without a redirect. `AuthLink` renders the plain `/auth` href as its `Link` target but navigates with the current-page redirect at click time. Remaining `/auth?mode=…` hits are intentional (forgot-password back-links, footer data href, `/login` + `/register` redirect routes, a comment).
- [x] Lint fix during verification: `AuthLink` initially used `useEffect` + `useState`, which `react-hooks/set-state-in-effect` rejects. Rewrote to compute the redirect at click time (click handler → `router.push(authHrefFromCurrent(...))`; modified clicks fall back to the plain `/auth` href).

---

## Critical files touched

| File | Action | Why |
|---|---|---|
| `src/components/auth/auth-utils.ts` | Edit | New `authHrefFromCurrent` helper + internal-path guard in `resolveRedirect` |
| `src/components/auth/auth-link.tsx` | New | SSR-safe `<Link>` that carries the current page as redirect (navbar/footer) |
| `src/components/book/wishlist-button.tsx` | Edit | Gate CTA passes current page as redirect |
| `src/components/shared/login-gate-dialog.tsx` | Edit | Gate CTA passes current page as redirect |
| `src/components/account/account-shell.tsx` | Edit | Guest redirect carries current account page |
| `src/components/shared/navbar.tsx` | Edit | Login links → `AuthLink` (desktop + sheet) |
| `src/components/shared/footer.tsx` | Edit | Login / Create-account links → `AuthLink` |

Unaffected: `/auth`, all auth forms, `google-button`, `email-verification`, `resolveRedirect` callers, stores, constants.

## New components

| Component | Type | Purpose |
|---|---|---|
| `auth/auth-link.tsx` | client | `<Link>` to `/auth` that preserves the current page as the post-auth redirect; used by navbar + footer |

## New dependencies required

None — only `next/link`, `next/navigation`, and existing helpers.

## Testing strategy

No test framework is configured, so:

- **Static**: `npm run lint`, `npm run typecheck`.
- **Manual QA**: from `/book?q=…`, `/book/<slug>`, `/cart`, `/account/profile` — trigger login via the matching CTA (wishlist heart, add-to-collection, review form, cart gate, account shell redirect, navbar, footer) → sign in as `customer@readora.com` → land back on the exact page incl. query string. Navbar/footer links preserve query on catalog pages. Admin sign-in (`admin@readora.com`) always lands on `/admin`. Logged-in → Log out → repeat from a new page.
