# Plan — Authentication (`/auth`)

## Design direction

Same cream / forest-green / Fraunces identity as the rest of the shop. `/auth` is a single centered card on a quiet background: brand wordmark up top, a two-tab switcher (Log in / Sign up), then the form. Forms use the existing `Input`/`Button`/`Label` primitives with inline field errors, a `font-heading` title, and the existing cream/forest palette. No new palette.

## Decisions (confirmed)

- **`/auth` is a server page** that reads `searchParams` once (`mode`, `redirect`) and renders a client `AuthView` shell with typed props. Mode switching is done with plain `next/link` anchors (`/auth?mode=register`), so URLs stay shareable/bookmarkable (FR-1.1/1.2) with zero Suspense complexity. `redirect` is passed through the mode-switch links so it isn't lost.
- **Login validation lives in the store.** `auth-store` keeps an internal `passwords: Record<string, string>` map (seeded from `src/data/users.ts` demo passwords; new ones added on register) so `login(email, password)` can return a boolean without polluting the `User` type (FR-8.1 keeps `User` clean).
- **Verification code is component state**, not store state: `RegisterForm` keeps the generated code + a 30s resend cooldown; on correct code it calls `store.verifyEmail(userId)`. Wrong code → inline error + input cleared (FR-3.3/3.4).
- **OTP input is a single 6-digit numeric `Input`** (`inputMode="numeric"`, `maxLength={6}`, letter-spaced monospace) — simpler and fully accessible vs. 6 auto-advancing boxes; paste works for free.
- **Google login** is a shared `GoogleButton` that simulates a ~1s loading state then calls `store.googleLogin()` (always creates a Customer session, FR-5.4).
- **Post-login redirect** is a single helper `resolveRedirect(user, redirectParam)` → `"admin" ? "/admin" : (redirectParam || "/")` (FR-1.4, FR-7.7).
- **zod v4 API**: use `z.email()` (top-level), `z.string().min(8).regex(...)` for password, `z.string().regex(PHONE_REGEX)` for phone. DOB validated with `date-fns` `parse` + `differenceInYears` (18–120).
- **No new dependencies** — `react-hook-form`, `zod`, `@hookform/resolvers`, `date-fns`, `sonner` are all installed; Toaster already mounted in the root layout.
- **DOB is a calendar datepicker** (user request, after Step 4): `npx shadcn add calendar popover` added `src/components/ui/calendar.tsx` + `popover.tsx` and pulled in **`react-day-picker` v10** (the one new dependency). DOB stores an ISO `yyyy-MM-dd` string; the picker disables days outside the 18–120 window (`disabled={{ after, before }}`, `startMonth`/`endMonth` + `captionLayout="dropdown"`), zod still re-checks age as a safety net.

---

## Step-by-step implementation

### Step 1 — Types, constants, seed data
- [x] New `src/types/user.ts`: `UserRole = "customer" | "admin"`, `UserProvider = "credentials" | "google"`, `User { id, name, email, phone, dateOfBirth (ISO string), role, provider, emailVerified }` (FR-8.1).
- [x] New `src/constants/auth.ts`: `PASSWORD_REGEX` (8+ chars, ≥1 letter + ≥1 number), `PHONE_REGEX` (VN mobile, 10 digits starting `0`), `MIN_AGE = 18`, `MAX_AGE = 120`, `DEMO_VERIFICATION_CODE = "123456"`, `RESEND_COOLDOWN_SECONDS = 30`, `DEFAULT_REDIRECT = "/"`, demo credential strings (`DEMO_ADMIN_EMAIL/PASSWORD`, `DEMO_CUSTOMER_EMAIL/PASSWORD`) (FR-8.2).
- [x] New `src/data/users.ts`: seed one admin (`admin@readora.com`, verified, credentials provider) + one customer (`customer@readora.com`, verified) with plaintext demo passwords (FR-8.5).

### Step 2 — Rewrite `auth-store`
- [x] Rewrite `src/stores/auth-store.ts`: `user: User | null`, `registeredUsers: User[]` (seeded from `src/data/users.ts`), internal `passwords: Record<string, string>`; actions `register(data) → User` (creates unverified customer, FR-2.3/2.5), `verifyEmail(userId)` (marks verified + signs in, FR-3.3), `login(email, password) → boolean` (validates against registered list, FR-4.2/4.3), `googleLogin()` (creates/signs in demo Google customer, FR-5.2), `logout()`; export `selectIsAuthenticated` selector; **remove `toggle`** (FR-7.1/7.2).
- [x] Interim fix-ups (pending Steps 5–6): `review-form`, `wishlist-button`, `add-to-collection-button` → `selectIsAuthenticated`; `navbar` → `selectIsAuthenticated` + icon button now calls `logout` (the old `toggle` preview is gone). Added `DEMO_GOOGLE_EMAIL` to `constants/auth.ts`. Verified with `npx tsc --noEmit` + `npm run lint`.

### Step 3 — Routes
- [x] New `src/app/(auth)/auth/page.tsx` (server): parse `mode` (default `login`, invalid → login) + `redirect`; render `<AuthView mode redirect />` (FR-1.1/1.4).
- [x] Rewrite `src/app/(auth)/login/page.tsx` → `redirect("/auth?mode=login")` (FR-1.3).
- [x] Rewrite `src/app/(auth)/register/page.tsx` → `redirect("/auth?mode=register")` (FR-1.3).
- [x] New `src/app/(auth)/forget-password/page.tsx` (server): render `<ForgotPasswordForm />` (FR-6.1).
- [x] Minimal stubs `auth-view.tsx` + `forgot-password-form.tsx` created so routes build; full bodies come in Step 4. Verified `tsc`, `lint`, `next build` — `/auth` is ƒ (dynamic), all routes registered.

### Step 4 — Auth components (`src/components/auth/`)
- [x] `auth-view.tsx` (client): brand header, Log in / Sign up tab links, mode switch links ("Sign up" ↔ "Log in", FR-4.4), renders `LoginForm` or `RegisterForm`, keeps `redirect` in all links; each form navigates with `router.push(resolveRedirect(...))`.
- [x] `login-form.tsx` (client): RHF + zod schema (email + password); password visibility toggle (FR-4.1); generic "Invalid email or password" inline error (FR-4.3); demo-hint box surfacing seeded admin + customer credentials (FR-7.8); "Forgot password?" → `/forget-password`; submit → `store.login()` → success: toast + navigate, fail: inline error (FR-4.2); `GoogleButton` (FR-4.5).
- [x] `register-form.tsx` (client): RHF + zod schema (name ≥2, `z.email()`, password policy, confirm match, DOB **calendar datepicker** (18–120 via date-fns, disabled days), phone regex) with inline errors (FR-2.2); pending submit state + toast (FR-2.4); on success → `store.register()` → local transition to `<EmailVerification>` (FR-2.3); `GoogleButton` (FR-5.1). DOB field uses `DatePickerField` via RHF `Controller`.
- [x] `email-verification.tsx` (client): "We sent a 6-digit code to `<email>`" (FR-3.1), single 6-digit numeric input, demo-mode note showing the current code (FR-3.2), correct → `verifyEmail()` → toast + navigate (FR-3.3), wrong → inline error + clear (FR-3.4), resend with 30s countdown regenerating code (FR-3.5), "Back to login" link (FR-3.6).
- [x] `google-button.tsx` (client, shared): "Continue with Google" with Google `G` mark; ~1s loading state → `store.googleLogin()` → toast + navigate (FR-5.2/5.3).
- [x] `forgot-password-form.tsx` (client): step 1 email input (format-validated) → simulated send; step 2 "If an account exists for `<email>`…" + resend (cooldown) + "Back to login" (FR-6.2/6.3/6.4). Renders its own centered card shell (route not wrapped in `AuthView`).
- [x] `form-field.tsx` (shared): small wrapper = `Label` + `Input` + error message, reused by all forms (keeps forms small).
- [x] `auth-utils.ts` (pure): `authHref(mode, redirect)` + `resolveRedirect(user, redirectParam)` + `AuthMode` type (shared by login/register/verification/google flows).
- [x] `use-resend-cooldown.ts` (client hook, added): shared 30s countdown for the verification + forgot-password resend buttons (dedupes logic across both).

### Step 5 — Navbar integration
- [ ] Edit `src/components/layout/navbar.tsx`: logged out → **Log in** button → `/auth?mode=login` (desktop + mobile sheet, FR-7.2); remove the `toggle` preview button; logged in → `Avatar` with user initials + dropdown (Account, Wishlist, **Admin dashboard** → `/admin` only when `user.role === "admin"`, Log out) (FR-7.2); mobile sheet gets the same entries. `logout` keeps working (AC-9).

### Step 6 — Remaining consumers
- [ ] Edit `src/components/layout/footer.tsx`: `Log in` → `/auth?mode=login`, `Create an account` → `/auth?mode=register` (FR-7.3).
- [ ] Edit `src/components/shared/login-gate-dialog.tsx`: CTA `router.push("/auth?mode=login")` (FR-7.4).
- [ ] Edit `src/components/book/wishlist-button.tsx`: gate CTA → `/auth?mode=login` (FR-7.4).

### Step 7 — Verification
- [ ] `npm run lint` · `npx tsc --noEmit` · `npm run build` + manual QA (below) (AC-10).

---

## Critical files touched

| File | Action | Why |
|---|---|---|
| `src/stores/auth-store.ts` | Rewrite | Boolean preview → real `User` state, seeded users, `register/verifyEmail/login/googleLogin/logout` (FR-7.1, AC-9) |
| `src/app/(auth)/auth/page.tsx` | New | Single auth shell reading `mode` + `redirect` searchParams (FR-1.1/1.4) |
| `src/app/(auth)/login/page.tsx`, `register/page.tsx` | Rewrite | Placeholders → redirects to `/auth?mode=…` (FR-1.3) |
| `src/app/(auth)/forget-password/page.tsx` | New | Forgot-password route (FR-6.1) |
| `src/components/layout/navbar.tsx` | Edit | Real auth state: Log in link, initials avatar + dropdown, admin entry; removes `toggle` (FR-7.2) |
| `src/components/layout/footer.tsx` | Edit | Links → `/auth?mode=…` (FR-7.3) |
| `src/components/shared/login-gate-dialog.tsx` | Edit | Gate CTA → `/auth?mode=login` (FR-7.4) |
| `src/components/book/wishlist-button.tsx` | Edit | Gate CTA → `/auth?mode=login` (FR-7.4) |
| `src/types/user.ts` | New | `User` model (FR-8.1) |
| `src/constants/auth.ts` | New | Regexes, age rule, demo code, cooldown, demo credentials (FR-8.2) |
| `src/data/users.ts` | New | Seeded admin + customer accounts (FR-8.5) |

Unaffected: home, catalog, book detail, cart/checkout placeholders, `cart-store`, `collections-store`.

## New components

| Component | Type | Purpose |
|---|---|---|
| `auth/auth-view.tsx` | client | Mode shell: brand, tabs, mode-switch links, renders the active form |
| `auth/login-form.tsx` | client | Login form + demo hint + Google button + forgot link |
| `auth/register-form.tsx` | client | 6-field register form with inline validation, hands off to verification |
| `auth/email-verification.tsx` | client | 6-digit code step, resend cooldown, demo code note |
| `auth/google-button.tsx` | client | Simulated OAuth button (loading → customer sign-in) |
| `auth/forgot-password-form.tsx` | client | Two-step request → confirmation flow |
| `auth/form-field.tsx` | client | Label + input + inline error wrapper |
| `auth/auth-utils.ts` | pure | `resolveRedirect(user, redirect)` role-aware helper |
| `auth/use-resend-cooldown.ts` | client hook | Shared 30s resend countdown (verification + forgot-password) |
| `auth/date-picker-field.tsx` | client | Calendar popover for DOB (ISO string, 18–120 days disabled) |
| `ui/calendar.tsx`, `ui/popover.tsx` | shadcn | Generated via `npx shadcn add` (Base UI, react-day-picker v10) |

## New routes

| Route | Notes |
|---|---|
| `/auth?mode=login|register` | Replaces the two placeholders; `mode` defaults to login |
| `/forget-password` | New under `(auth)` group |
| `/login`, `/register` | Now redirect to `/auth?mode=…` (kept for existing links) |

## New dependencies required

**One new dependency:** `react-day-picker@^10` (installed by `npx shadcn add calendar`; `date-fns` was already present). Everything else — `react-hook-form`, `zod` (v4), `@hookform/resolvers`, `sonner`, and `lucide-react` — was already installed. Toaster already mounted in the root layout.

## Testing strategy

No test framework is configured, so:

- **Static**: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- **Manual QA** (maps to AC-1..10): `/auth` defaults to Login; `?mode=register` shows Register; switching modes updates the URL and preserves `redirect`; `/login` & `/register` redirect; Navbar/Footer/LoginGateDialog/WishlistButton links land on the right mode. Register: empty submit shows all 6 inline errors; name <2; bad email; weak password (no number / short); mismatched confirm; DOB left empty, and the picker greys out dates under 18 or over 120 (zod re-checks as a safety net); phone not matching VN regex — none can submit; valid submit shows pending state + toast + verification step, user not signed in yet. Verification: demo code shown; correct code verifies + signs in + toasts + navigates; wrong code errors + clears; resend works after 30s and regenerates the code; Back to login works. Login: seeded admin (`admin@readora.com`) → redirected to `/admin`; seeded customer → `/` and `/redirect-param`; wrong credentials → generic error only; demo hint shows both credentials; password visibility toggle. Google: ~1s loading from both modes, always customer, toast + navigation. Forgot password: bad email blocked; valid email → confirmation with email echoed; resend + cooldown; back to login. Navbar: logged-out → Log in; logged-in → initials avatar + dropdown (Account, Wishlist, Log out, plus Admin dashboard for admin); logout returns to signed-out state and clears the cart-gate behavior. Dark mode + keyboard focus on every control; reload resets to logged-out (in-memory).
