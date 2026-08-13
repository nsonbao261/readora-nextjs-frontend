"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  FolderIcon,
  HeartIcon,
  MapPinIcon,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";
import { useCollectionsStore } from "@/stores/collections-store";
import { addresses } from "@/data/addresses";
import { wishlistBookIds } from "@/data/wishlist";
import { orders } from "@/data/orders";
import { formatDate, formatPrice } from "@/lib/format";
import { StatusBadge } from "@/components/account/status-badge";
import { Card, CardContent } from "@/components/ui/card";

// Account overview: eyebrow + Fraunces greeting, three count cards (collections,
// wishlist, addresses) and the three most recent orders with status — every
// block links to its section (FR-2.1).
export function AccountOverview() {
  const user = useAuthStore((state) => state.user);
  const collectionCount = useCollectionsStore(
    (state) => state.collections.length,
  );

  // Guests are redirected by the shell; this guard satisfies typing.
  if (!user) return null;

  const firstName = user.name.trim().split(" ")[0];
  const recentOrders = orders.slice(0, 3);

  const summaryCards = [
    {
      label: "Collections",
      value: collectionCount,
      href: "/account/collections",
      icon: FolderIcon,
    },
    {
      label: "Wishlist",
      value: wishlistBookIds.length,
      href: "/account/wishlist",
      icon: HeartIcon,
    },
    {
      label: "Addresses",
      value: addresses.length,
      href: "/account/addresses",
      icon: MapPinIcon,
    },
  ];

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
          Account
        </p>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight sm:text-4xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here&apos;s what&apos;s happening with your books at Readora.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group block focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Card className="h-full transition-colors group-hover:ring-primary/40">
                <CardContent className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                      {card.label}
                    </p>
                    <p className="mt-1 font-heading text-3xl font-medium">
                      {card.value}
                    </p>
                  </div>
                  <span className="rounded-full bg-muted p-2.5 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <Icon className="size-5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-medium">Recent orders</h2>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            View all
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <Card>
            <CardContent className="text-muted-foreground">
              No orders yet.
            </CardContent>
          </Card>
        ) : (
          <Card className="p-0">
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between gap-3 px-(--card-spacing) py-3 transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{order.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.placedAt)} ·{" "}
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-medium">
                      {formatPrice(order.total)}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}
