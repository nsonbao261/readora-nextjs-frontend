"use client";

import Link from "next/link";
import { HeartIcon, LogInIcon, LogOutIcon, MenuIcon, UserRoundIcon } from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Shared nav link for desktop bar and mobile sheet.
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Books", href: "/book" },
];

// Site-wide sticky navigation. Reads the simulated auth state and renders the
// right account controls accordingly; the subtle icon toggle previews the
// signed-in state (no backend exists yet).
export function Navbar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const toggle = useAuthStore((state) => state.toggle);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Readora
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggle}
            aria-label={
              isAuthenticated ? "Sign out (preview)" : "Sign in (preview)"
            }
          >
            {isAuthenticated ? <LogOutIcon /> : <LogInIcon />}
          </Button>

          {isAuthenticated ? (
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Account menu"
                    />
                  }
                >
                  <UserRoundIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem render={<Link href="/account" />}>
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/wishlist" />}>
                    <HeartIcon />
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={logout}>
                    <LogOutIcon />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/login" className="hidden md:block">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
          )}

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon-sm" aria-label="Open menu" />
                }
              >
                <MenuIcon />
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Browse the shop or manage your account.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-1 px-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <Separator />
                {isAuthenticated ? (
                  <div className="flex flex-col gap-1 px-4">
                    <Link
                      href="/account"
                      className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      Account
                    </Link>
                    <Link
                      href="/wishlist"
                      className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      Wishlist
                    </Link>
                    <button
                      type="button"
                      onClick={logout}
                      className="rounded-md px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-muted"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="px-4 pt-1">
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="w-full">
                        Log in
                      </Button>
                    </Link>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
