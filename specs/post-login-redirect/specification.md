# Post-Login Redirect — Specification

**Feature:** Return users to the page they were on after signing in
**Version:** 1.0
**Status:** Draft — awaiting confirmation

## 1. Feature Overview

After login, users are currently redirected to `/` (customers) or `/admin` (admins). This feature changes that so **customers return to the page they were on** when they triggered the login flow (e.g. a catalog page with active filters, a book detail page, an account page). Admins keep the existing `/admin` override.

The app already has a complete `redirect` mechanism: `/auth` reads an optional `redirect` query param, threads it through every link and form (`auth-view`, `login-form`, `register-form`, `google-button`, `email-verification`), and `resolveRedirect(user, redirect)` picks the final destination. The only gap is that the **entry points** that send guests to `/auth` never pass the current page as the `redirect` param, so users fall through to the default `/`.

## 2. Scope

### In Scope

- All auth entry points pass the current page (path + query string) as the `redirect` target:
  - `WishlistButton` login gate CTA (book card + book detail).
  - `LoginGateDialog` CTA (cart summary, review form, add-to-collection).
  - `AccountShell` guest redirect (all `/account/*` pages).
  - Navbar "Log in" links (desktop + mobile sheet).
  - Footer "Log in" and "Create an account" links.
- New shared `authHrefFromCurrent(mode, pathname, search)` helper.
- New shared `AuthLink` client component for navbar/footer static links (SSR-safe).
- Harden `resolveRedirect` against open-redirect (internal paths only).
- Admin override to `/admin` is preserved unchanged.

### Out of Scope

- Changes to `/auth`, the forms, `google-button`, `email-verification`, or `resolveRedirect` callers' signatures.
- Changing admin post-login behavior (stays `/admin`).
- Redirecting the `/forget-password` internal links (no meaningful "current page" to preserve).
- URL validation beyond the internal-path guard.
