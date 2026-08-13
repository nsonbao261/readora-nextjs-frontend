"use client";

import { useState } from "react";
import Link from "next/link";
import { PackageIcon } from "lucide-react";

import { orders as seedOrders } from "@/data/orders";
import { formatDate, formatPrice } from "@/lib/format";
import { StatusBadge } from "@/components/account/status-badge";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Order history for the signed-in user, seeded newest-first (defensive sort on
// mount). Each row links to the order detail; an empty history shows the
// dashed empty state (FR-8.1, 8.2).
export function OrdersList() {
  const [orders] = useState(() =>
    [...seedOrders].sort((a, b) => b.placedAt.localeCompare(a.placedAt)),
  );

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
          Account
        </p>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">
          Orders
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track deliveries and review past orders.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
          <div className="rounded-full border border-dashed border-border p-3">
            <PackageIcon className="size-6 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-xl font-medium">No orders yet</h2>
          <p className="text-muted-foreground">
            When you place an order it will show up here.
          </p>
          <Link href="/book" className={cn(buttonVariants({ variant: "outline" }))}>
            Browse books
          </Link>
        </div>
      ) : (
        <Card className="p-0">
          <div className="divide-y divide-border">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between gap-3 px-(--card-spacing) py-3 transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.placedAt)} · {order.items.length}{" "}
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
    </div>
  );
}
