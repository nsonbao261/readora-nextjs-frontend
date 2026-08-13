"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeftIcon,
  MapPinIcon,
  XCircleIcon,
} from "lucide-react";
import { toast } from "sonner";

import { OrderStatus, type Order } from "@/types/order";
import { orders as seedOrders } from "@/data/orders";
import {
  CANCELLABLE_STATUSES,
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
} from "@/constants/orders";
import { formatDate, formatPrice } from "@/lib/format";
import { StatusBadge } from "@/components/account/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Progress timeline: completed steps are filled, the current step is marked,
// upcoming steps stay muted. Cancelled orders short-circuit to a distinct
// destructive state (FR-9.2).
function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === OrderStatus.Cancelled) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive">
        <XCircleIcon className="size-4" />
        This order was cancelled
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(status);
  return (
    <ol className="space-y-0">
      {ORDER_STATUS_FLOW.map((step, index) => {
        const reached = index <= currentIndex;
        return (
          <li
            key={step}
            className="relative flex gap-3 pb-5 last:pb-0"
          >
            {index < ORDER_STATUS_FLOW.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-4 left-[5px] h-full w-px",
                  reached && index < currentIndex ? "bg-primary" : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "relative mt-1.5 size-2.5 shrink-0 rounded-full ring-4 ring-background",
                reached ? "bg-primary" : "bg-muted",
              )}
            />
            <div>
              <p
                className={cn(
                  "text-sm",
                  reached
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {ORDER_STATUS_LABELS[step]}
              </p>
              {step === status && (
                <p className="text-xs text-muted-foreground">
                  Current status
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// Order detail: line items (cover/title/price/qty), totals, the shipping
// address snapshot, and a status timeline. Cancellation is offered only for
// pre-shipment statuses, gated behind a confirm dialog; cancelling flips the
// local status and hides the action (FR-9.1..9.4, 10.1).
export function OrderDetail({ id }: { id: string }) {
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [cancelOpen, setCancelOpen] = useState(false);
  const order = orders.find((candidate) => candidate.id === id);

  // Unknown id → not-found style empty state.
  if (!order) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
        <h1 className="font-heading text-xl font-medium">Order not found</h1>
        <p className="text-muted-foreground">
          This order doesn&apos;t exist or was removed.
        </p>
        <Link
          href="/account/orders"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <ArrowLeftIcon />
          Back to orders
        </Link>
      </div>
    );
  }

  const cancellable = CANCELLABLE_STATUSES.includes(order.status);

  function handleCancel() {
    setOrders((current) =>
      current.map((candidate) =>
        candidate.id === id
          ? { ...candidate, status: OrderStatus.Cancelled }
          : candidate,
      ),
    );
    toast.success("Order cancelled");
    setCancelOpen(false);
  }

  return (
    <div className="max-w-3xl">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
          Account
        </p>
        <Link
          href="/account/orders"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          <ArrowLeftIcon className="size-4" />
          Orders
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl font-medium tracking-tight">
              {order.id}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed {formatDate(order.placedAt)}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline status={order.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Items ({order.items.reduce((sum, item) => sum + item.quantity, 0)})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div
                    key={item.bookId}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.cover}
                        alt={`${item.title} cover`}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatPrice(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-medium">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2 text-sm">
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {order.shippingAddress.recipientName}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {order.shippingAddress.street},{" "}
                    {order.shippingAddress.ward},{" "}
                    {order.shippingAddress.district},{" "}
                    {order.shippingAddress.provinceCity}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {cancellable && (
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => setCancelOpen(true)}
            >
              <XCircleIcon />
              Cancel order
            </Button>
          )}
        </div>
      </div>

      <Dialog
        open={cancelOpen}
        onOpenChange={(open) => !open && setCancelOpen(false)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Cancel order {order.id}?</DialogTitle>
            <DialogDescription>
              This can&apos;t be undone. The order will be marked as cancelled.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              Keep order
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              <XCircleIcon />
              Cancel order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
