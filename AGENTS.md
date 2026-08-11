# AGENTS.md

## Project Overview

Next.js 16 (App Router) storefront frontend for Readora, a book shop. UI-only repo (no backend, no API routes, no server actions). Root layout in `src/app/layout.tsx` is the only layout and mounts `Navbar`, `Footer`, and the sonner `Toaster` around `children`; route groups have no layouts of their own.

## Tech Stack

- Next.js 16 App Router, React 19, TypeScript (strict)
- Tailwind CSS v4 — **CSS-first config**: no `tailwind.config`; tokens live in `src/app/globals.css` (`:root`, `.dark`, `@theme inline`, `@custom-variant dark`). Imports `tw-animate-css` and `shadcn/tailwind.css`
- shadcn v4 on **Base UI** (`@base-ui/react`) — NOT Radix. `components.json` style is `base-nova`. shadcn `ui/*` components import e.g. `Button as ButtonPrimitive` from `@base-ui/react/button`
- Fonts: Geist (sans) + Fraunces (heading) via `next/font/google` in `src/app/layout.tsx`; use the `font-heading` utility for display text
- Theme: `next-themes` wired in root layout (`attribute="class"`, `defaultTheme="system"`); dark mode is `.dark` class on `<html>`
- Icons: `lucide-react`. State: `zustand` (stores in `src/stores`: auth, cart, collections — all functional)
- Forms: `react-hook-form` + `zod` + `@hookform/resolvers/zod` (auth forms); toasts via `sonner` mounted in `src/components/shared/toaster.tsx`
- Dates: `date-fns`; `react-day-picker` powers `src/components/ui/calendar.tsx`
- No shadcn `form` or `toast` components generated; auth forms use `src/components/auth/form-field.tsx`, toasts use the sonner `Toaster` directly

## Folder Structure

```
src/
├── app/                       # Routes as route groups; group name is only for nesting, inner folder = URL
│   ├── layout.tsx             # Root layout (the only one) — fonts + next-themes + Navbar/Footer/Toaster
│   ├── globals.css            # Tailwind v4 tokens: :root, .dark, @theme inline
│   ├── (public)/              # → /
│   ├── (catalog)/             # → /catalog, /product/[id]
│   ├── (account)/             # → /account, /collections, /wishlist
│   ├── (auth)/                # → /login, /register
│   ├── (admin)/               # → /admin, /admin/books, /admin/orders, /admin/reports, /admin/users
│   └── (checkout)/            # → /cart, /checkout, /shipping, /payment
├── components/
│   ├── ui/                    # shadcn primitives (alert, avatar, badge, button, calendar, card, checkbox,
│   │                          #   dialog, dropdown-menu, input, label, popover, select, separator, sheet,
│   │                          #   skeleton, tabs, textarea)
│   ├── shared/                # navbar, footer, toaster, login-gate-dialog
│   ├── auth/                  # login/register/forgot-password forms, auth-view, form-field, date-picker-field,
│   │                          #   email-verification, google-button, auth-utils, use-resend-cooldown
│   ├── book/                  # book-card, rating, wishlist-button, cart-actions, add-to-collection-button,
│   │                          #   shipping-info, similar-books, reviews-section, review-form
│   ├── catalog/               # search-bar, sort-control, filter-panel, pagination
│   ├── landing/               # hero-banner
│   └── providers/             # theme-provider → next-themes wrapper
├── constants/                 # auth.ts, catalog.ts, shipping.ts
├── data/                      # mock data (books, reviews, users)
├── lib/                       # utils.ts → cn() helper; format.ts, similar-books.ts, catalog.ts
├── stores/                    # zustand stores (auth, cart, collections)
└── types/                     # shared types (book, review, user)
```

Path alias: `@/*` → `src/*`

## Important Rules

- No unapproved shell commands, except for verification and formatting. For other commands, guide user to do it manually
- No unapproved code changes, always stop to show differences
- Always ask clarifying questions
- Keep functions small; break functions down for readability when possible
- Recommend new dependencies if possible
- Use a comment at each function for explanation

## Commands

- Dev server: `npm run dev`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Format: `npm run format` (prettier over `src/**/*.{ts,tsx,css,json}`; `.prettierrc.json`: semicolons, double quotes)
- Build: `npm run build`
- No test framework or CI is configured.
- Add shadcn components with `npx shadcn add <name>`; generated files go to `src/components/ui/`.
- Repo is under git (conventional commits, PRs via GitHub). Skills live in `.agents/skills/` (frontend-design, nextjs-app-router-patterns, shadcn) and are auto-loaded.

## Workflow

- Read folder structure and analyze the request.
- Draft specification for this request and ask for confirmation. If confirmed, save as `/specs/<feature-name>/specification.md`
- Based on specification, draft a plan for implementation and ask for approval. If approved, save as `/specs/<feature-name>/plan.md`
- Guide user to implement plan. At each step, always stop to show code changes and ask for approval.
