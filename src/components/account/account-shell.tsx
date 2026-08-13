"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderIcon,
  HeartIcon,
  LayoutDashboardIcon,
  LockKeyholeIcon,
  MapPinIcon,
  PackageIcon,
  UserRoundIcon,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Account section navigation entries (render order). Icons mirror the navbar's
// account menu so the sections read as one family.
const accountLinks = [
  { label: "Overview", href: "/account", icon: LayoutDashboardIcon },
  { label: "Profile", href: "/account/profile", icon: UserRoundIcon },
  { label: "Password", href: "/account/password", icon: LockKeyholeIcon },
  { label: "Collections", href: "/account/collections", icon: FolderIcon },
  { label: "Wishlist", href: "/account/wishlist", icon: HeartIcon },
  { label: "Addresses", href: "/account/addresses", icon: MapPinIcon },
  { label: "Orders", href: "/account/orders", icon: PackageIcon },
];

// True when the current path is the link or a descendant. Overview is matched
// exactly so /account/profile etc. don't highlight it (FR-1.1).
function isActive(pathname: string, href: string): boolean {
  if (href === "/account") return pathname === "/account";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Shell for every (account) page: redirects signed-out visitors to the login
// page and renders the section nav beside the page content. On mobile the nav
// collapses into a horizontal scroll row (FR-1.1, FR-1.3).
export function AccountShell({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const pathname = usePathname();
  const router = useRouter();

  // Guests get sent to login; a skeleton shows while the effect runs.
  useEffect(() => {
    if (!user) router.replace("/auth?mode=login");
  }, [user, router]);

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <Skeleton className="h-10 w-48" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
          <Skeleton className="h-64 w-full lg:w-56" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid items-start gap-8 lg:grid-cols-[220px_1fr]">
        <nav
          aria-label="Account sections"
          className="flex gap-1 overflow-x-auto pb-1 lg:sticky lg:top-20 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {accountLinks.map((link) => {
            const active = isActive(pathname, link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
