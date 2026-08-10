# AGENTS.md

## Project Overview

Next.js 16 (App Router) storefront frontend for Readora, a book shop. Bootstrapped from `create-next-app`; most routes are "under construction" placeholders. UI-only repo (no backend, no API routes yet). The root layout in `src/app/layout.tsx` is the only layout — route groups have no layouts, and there is no header/footer/nav yet.

## Tech Stack

- Next.js 16 App Router, React 19, TypeScript (strict)
- Tailwind CSS v4 — **CSS-first config**: there is no `tailwind.config`, tokens live in `src/app/globals.css` (`:root`, `.dark`, `@theme inline`)
- shadcn v4 on **Base UI** (`@base-ui/react`) — NOT Radix. UI components import `Button as ButtonPrimitive` from `@base-ui/react/button`, etc.
- Fonts: Geist (sans) + Fraunces (heading) loaded via `next/font/google` in `src/app/layout.tsx`; use the `font-heading` utility for display text
- Theme: `next-themes` already wired in the root layout (`attribute="class"`, `defaultTheme="system"`); dark mode is `.dark` class on `<html>`
- Icons: `lucide-react`. State: `zustand` (stores in `src/stores`, currently empty)
- Pre-installed but **unused** — don't assume they're wired up: `react-hook-form`, `zod`, `@hookform/resolvers`, `sonner`. No `form`/`toast` shadcn components generated yet

## Folder Structure

```
src/
├── app/                       # Routes as route groups; group name is only for nesting, inner folder = URL
│   ├── layout.tsx             # Root layout (the only one) — fonts + next-themes
│   ├── globals.css            # Tailwind v4 tokens: :root, .dark, @theme inline
│   ├── (public)/              # → /
│   ├── (catalog)/             # → /catalog, /product/[id]
│   ├── (account)/             # → /account, /collections, /wishlist
│   ├── (auth)/                # → /login, /register
│   ├── (admin)/               # → /admin, /admin/books, /admin/orders, /admin/reports, /admin/users
│   └── (checkout)/            # → /cart, /checkout, /shipping, /payment
├── components/
│   ├── ui/                    # shadcn primitives (alert, avatar, badge, button, card, dialog,
│   │                          #   dropdown-menu, input, select, separator, sheet, skeleton, tabs)
│   ├── book/                  # (empty) book-specific components
│   ├── layout/                # (empty) header / footer / nav
│   ├── shared/                # (empty) shared components
│   └── theme-provider.tsx     # next-themes wrapper
├── data/                      # (empty) mock data
├── lib/                       # utils.ts → cn() helper
├── stores/                    # (empty) zustand stores
└── types/                     # (empty) shared types
```

Path alias: `@/*` → `src/*`

## Important Rules

- No unapproved shell commands, except for verification and formatting. For other commands, guide user to do it manually
- No unapproved code changes, always stop to show differences.
- Always ask clarifying questions
- Keep functions small, if fucntions can be broken down to make it more readable, always go for it.
- Recomend new dependencies if possible.
- Use comment at each function for explanation

## Commands

- Dev server: `npm run dev`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit` (no npm script exists)
- Build: `npm run build`
- No test framework or CI is configured.
- Add shadcn components with `npx shadcn add <name>`; generated files go to `src/components/ui/`.
- The repo is not under git yet; skills live in `.agents/skills/` (frontend-design, nextjs-app-router-patterns, shadcn) and are auto-loaded.


## Workflow

- Read folder structure and analysis my request.
- Draft Specifiction for this request and ask for confirmation. If confirm, save as /specs/<feature-name>/specification.md
- Base on Specification, draft a plan for implementation and ask for approval. If approve, saved as /specs/<feature-name>/plan.md
- Guide user to implement plan. At each steps, always stop to show code changes and ask for approval.