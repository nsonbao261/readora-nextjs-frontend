# Authentication (`/auth`) — Specification

**Feature:** Authentication (Register, Login, Email Verification, Google Login, Forgot Password)
**Version:** 1.0
**Status:** Confirmed

## 1. Feature Overview

Build the authentication feature, replacing the current `/login` and `/register` placeholders with a single `/auth` page that hosts two modes — **Login** and **Register** — toggled via the URL. Users can create an account with an email + password (plus profile fields), go through a simulated email-verification step, log in with credentials or "Continue with Google", and request a password reset from `/forget-password`.

The feature is **UI-only**, matching the repo's existing pattern: there is no backend or real email/OAuth. Email verification, Google login, and the forgot-password flow are simulated in the browser with seeded demo behavior. Auth state lives in the existing zustand `auth-store`, extended to hold a user profile, and is **in-memory only** (lost on reload).

Auth is **role-aware**. Every user has a role — **Customer** (default) or **Admin** — and only customers are created by Register or Google sign-in; admin accounts are **seeded** in the mock data. After a successful login, admins are redirected to the Admin Dashboard (`/admin`, currently a placeholder), while customers go to the redirect target (or `/`). Google login is never available to Admin accounts.

## 2. Scope

### In Scope

- Single `/auth` page with two modes — `?mode=login` and `?mode=register` (default: login).
- **Register** form: Full name, Email, Password, Confirm password, Date of Birth (dd/mm/yyyy, 18+), Phone number — with inline validation.
- **Email verification** step after registration (simulated 6-digit code, resend with cooldown, demo code shown on screen).
- **Login** form: email + password, with error handling and a "Forgot password?" link.
- **Google login**: simulated "Continue with Google" button on login (and register).
- **Forgot password** page at `/forget-password`: email request → simulated "check your email" confirmation with resend.
- `/login` and `/register` kept as redirects to `/auth?mode=...` so existing links keep working.
- Update existing auth consumers (`Navbar`, `Footer`, `LoginGateDialog`, `WishlistButton`) to point at `/auth` and the real auth state.
- Extend the zustand `auth-store` with a `User` profile, `login(user)`, `logout()`, and `register(user)`; remove the simulated `toggle` preview.
- New `User` type, auth validation schemas + constants, and `src/components/auth/*` components.
- Use the pre-installed-but-unused libraries: `react-hook-form`, `zod`, `@hookform/resolvers` for forms, `date-fns` for DOB parsing/age, and `sonner` (toaster already wired in the root layout).
- Role-aware accounts: `User.role` of `"customer" | "admin"`; customers are created by Register and Google, admins are **seeded only**.
- Seeded mock accounts in `src/data/users.ts` (one admin + one customer) with a demo hint on the login form surfacing their credentials, so both login paths are demonstrable out of the box.
- Role-based post-login redirect: admin → `/admin`; customer → `redirect` param or `/`.
- Google login restricted to Customer sessions.

### Out of Scope

- Backend/API integration, real email sending, or real OAuth.
- Password reset that actually sets a new password (forgot-password is request-only, simulated).
- Auth state persistence across reloads (in-memory only).
- Session expiry, remember-me, refresh tokens.
- Building the `/account` profile page (stays a placeholder).
- Admin registration and admin user management (admin accounts are seeded only).
- Protecting `/admin` routes from non-admin access — only the post-login redirect is in scope.
- OAuth providers beyond Google.
- CSS/styling details (handled in implementation, not this spec).

## 3. Functional Requirements

### 3.1 Routes & Modes

- **FR-1.1** `/auth` renders either Login or Register based on the `mode` query param (`login` / `register`); missing or invalid `mode` defaults to **login**.
- **FR-1.2** Switching modes updates the URL (shareable/bookmarkable).
- **FR-1.3** `/login` and `/register` become lightweight redirects to `/auth?mode=login` and `/auth?mode=register`, keeping existing links (Navbar, Footer, LoginGateDialog, WishlistButton) working.
- **FR-1.4** `/auth` accepts an optional `redirect` query param; a successful auth action navigates there, defaulting to `/` when absent — except for **admins**, who are always sent to `/admin`.

### 3.2 Register

- **FR-2.1** Fields: **Full name**, **Email**, **Password**, **Confirm password**, **Date of Birth** (dd/mm/yyyy), **Phone number**.
- **FR-2.2** Validation (inline errors under each field):
  - Full name: required, min 2 characters.
  - Email: required, valid email format.
  - Password: required, min 8 chars, must contain at least one letter and one number.
  - Confirm password: must match the password.
  - Date of Birth: required, must be a real calendar date in `dd/mm/yyyy`, and the user must be **18 or older** (and not older than 120).
  - Phone number: required, valid phone format (VN mobile — 10 digits starting with `0`; regex kept as a constant so it's easily adjustable).
- **FR-2.3** On valid submit the account is created in the in-memory store and the register mode transitions to the email-verification step; the user is **not** signed in yet.
- **FR-2.4** The submit button shows a pending state while "submitting" and fires a confirmation toast.
- **FR-2.5** Registration always creates a **Customer** account (`role: "customer"`); the role is fixed and never selectable.

### 3.3 Email Verification (simulated)

- **FR-3.1** After registering, a verification step shows: "We sent a 6-digit code to `<email>`".
- **FR-3.2** A 6-digit numeric code input; a demo-mode note displays the code (e.g. `123456`) so the flow is demonstrable out of the box.
- **FR-3.3** Entering the correct code marks the user's email as verified, signs them in, fires a toast, and navigates to the redirect target (or `/`).
- **FR-3.4** An incorrect code shows an inline error and clears the input (no lockout).
- **FR-3.5** **Resend code** is available with a cooldown timer (~30s); resending regenerates the demo code.
- **FR-3.6** A "Back to login" link returns to login mode (the unverified account stays in memory only).

### 3.4 Login

- **FR-4.1** Fields: **Email**, **Password** — with a password visibility toggle and a **"Forgot password?"** link to `/forget-password`.
- **FR-4.2** Submitting validates against the in-memory registered user; a match signs in, fires a toast, and navigates to the redirect target (or `/`).
- **FR-4.3** No match shows a generic inline error ("Invalid email or password") — it does not reveal which field was wrong.
- **FR-4.4** A "Don't have an account? Sign up" link switches to register mode (updating the URL).
- **FR-4.5** A "Continue with Google" button is also available (see §3.5).

### 3.5 Google Login (simulated)

- **FR-5.1** A **"Continue with Google"** button renders on both login and register modes.
- **FR-5.2** Clicking it shows a brief loading state (~1s, simulating the OAuth redirect), then signs in as a demo Google user — `provider: "google"`, email verified, generated demo profile.
- **FR-5.3** A confirmation toast fires and the user is navigated to the redirect target (or `/`).
- **FR-5.4** Google login always produces a **Customer** session. Admin accounts can never be created or signed in via Google.

### 3.6 Forgot Password

- **FR-6.1** Route `/forget-password` under the `(auth)` group.
- **FR-6.2** Step 1: an email input (format-validated) with a submit action that simulates sending a reset email.
- **FR-6.3** Step 2: a confirmation state — "If an account exists for `<email>`, we've sent you a link" — with a **resend** action (cooldown) and a **Back to login** link.
- **FR-6.4** No password is actually reset (simulated request only).

### 3.7 Auth State & Integration

- **FR-7.1** Extend `auth-store`: `user: User | null`, `isAuthenticated` (derived), actions `register(user)` (unverified), `verifyEmail()`, `login(user)`, `logout()`.
- **FR-7.2** Navbar reflects real state: logged out → **Log in** button linking to `/auth?mode=login`; logged in → account dropdown (Account, Wishlist, Log out) with a user-initials avatar, plus an **Admin dashboard** entry (→ `/admin`) when the signed-in user is an admin. The simulated `toggle` preview is removed.
- **FR-7.3** Footer links updated: **Log in** → `/auth?mode=login`, **Create an account** → `/auth?mode=register`.
- **FR-7.4** `LoginGateDialog` and `WishlistButton` push to `/auth?mode=login` instead of `/login`.
- **FR-7.5** Auth state remains in-memory only (lost on reload).
- **FR-7.6** `User` carries a `role: "customer" | "admin"`; the auth store keeps an in-memory list of registered users seeded from `src/data/users.ts` (one admin + one customer) and validates login against it.
- **FR-7.7** Post-login redirect is role-based: admin → `/admin`; customer → `redirect` param or `/`.
- **FR-7.8** A demo hint on the login form surfaces the seeded credentials (admin + customer) so both roles are demonstrable.

## 4. Data Model

- **FR-8.1** New `src/types/user.ts`: `User { id, name, email, phone, dateOfBirth (ISO), role: "customer" | "admin", provider: "credentials" | "google", emailVerified: boolean }`.
- **FR-8.2** New `src/constants/auth.ts`: password regex (8+ chars, letter + number), phone regex, age rule (18), demo verification code, resend cooldown, default redirect target, demo credentials/passwords.
- **FR-8.3** Form schemas (zod) live with their form components.
- **FR-8.4** No new dependencies — `react-hook-form`, `zod`, `@hookform/resolvers`, `date-fns`, and `sonner` are already installed.
- **FR-8.5** New `src/data/users.ts` seeds the demo admin + customer accounts (plaintext demo passwords).

## 5. State & Routes

- Routes: `/auth?mode=login|register`, `/forget-password`; `/login` and `/register` redirect to `/auth`.
- Search params: `mode`, `redirect`.
- In-memory stores: `auth-store` (extended). On init it seeds its registered-user list from `src/data/users.ts`; roles drive the post-login redirect. Nothing persists across reloads.
- The server page renders the auth shell; client components render each mode's form.

## 6. Acceptance Criteria

1. `/auth` defaults to Login; `?mode=register` shows Register; mode switches update the URL.
2. `/login` and `/register` redirect correctly, and all existing links still work.
3. Register validates every field (including 18+ DOB, password policy, phone format, matching confirm) with inline errors; invalid input cannot submit.
4. Successful registration transitions to the verification step; entering the demo code verifies and signs in; a wrong code errors; resend works with a cooldown.
5. Login signs in with matching in-memory credentials and shows a generic error otherwise; the demo hint surfaces the seeded admin + customer credentials.
6. Logging in with the seeded admin account redirects to `/admin`; logging in as a customer goes to `redirect`/`/`.
7. "Continue with Google" simulates sign-in from both modes and always produces a Customer session — admins cannot use Google login.
8. `/forget-password` shows the request → confirmation → resend flow and a Back to login link.
9. Navbar shows correct state (logged out → Log in; logged in → dropdown + logout, plus an Admin dashboard entry for admins) and logout returns the app to the signed-out state.
10. `npm run lint` and `npx tsc --noEmit` pass.

## 7. Recommended Extensions (future, out of scope now)

- Full reset-password flow (verification code + new password) on `/forget-password`.
- Protect `/admin` routes so only admins can access them (route guards), plus an admin user-management page.
- `/account` profile page reading from `auth-store`.
- Auth persistence (localStorage/cookies) with session handling.
- Additional OAuth providers (Facebook, Apple).
- Real email/OTP delivery and rate limiting once a backend exists.

