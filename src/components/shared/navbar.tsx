"use client";

import Link from "next/link";
import {
  HeartIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  PackageIcon,
  ShoppingCartIcon,
  UserRoundIcon,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";
import { useCartStore, selectCount } from "@/stores/cart-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

// Derives the avatar initials (max 2) from a display name, e.g. "Readora
// Admin" → "RA".
function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

// Site-wide sticky navigation. Reads the real auth user and renders the right
// account controls: guests get a Log in link, signed-in users get an initials
// avatar + dropdown with an Admin dashboard entry for admins (FR-7.2).
export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartCount = useCartStore((state) => selectCount(state.items));

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
          <Link
            href="/cart"
            aria-label="View cart"
            className="relative rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Button variant="ghost" size="icon-sm" aria-hidden="true">
              <ShoppingCartIcon />
            </Button>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer rounded-full p-0"
                      aria-label="Account menu"
                    />
                  }
                >
                  <Avatar>
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    render={<Link href="/account" />}
                  >
                    <UserRoundIcon />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    render={<Link href="/account/wishlist" />}
                  >
                    <HeartIcon />
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    render={<Link href="/account/orders" />}
                  >
                    <PackageIcon />
                    Orders
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      render={<Link href="/admin" />}
                    >
                      <LayoutDashboardIcon />
                      Admin dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={logout}
                  >
                    <LogOutIcon />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/auth?mode=login" className="hidden md:block">
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
                {user ? (
                  <div className="flex flex-col gap-1 px-4">
                    <div className="flex items-center gap-2 px-3 py-2">
                      <Avatar size="sm">
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                    <Link
                      href="/account"
                      className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      Account
                    </Link>
                    <Link
                      href="/account/wishlist"
                      className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      Wishlist
                    </Link>
                    <Link
                      href="/account/orders"
                      className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      Orders
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                      >
                        Admin dashboard
                      </Link>
                    )}
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
                    <Link href="/auth?mode=login">
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
