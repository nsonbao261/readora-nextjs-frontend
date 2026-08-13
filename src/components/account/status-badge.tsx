"use client";

import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABELS } from "@/constants/orders";
import { OrderStatus } from "@/types/order";

// Badge variant per order status. `pending` reads neutral, `processing` is the
// active primary state, shipped/delivered are quiet outline, cancelled is the
// only destructive state.
const STATUS_VARIANTS: {
  [K in OrderStatus]: "default" | "secondary" | "outline" | "destructive";
} = {
  [OrderStatus.Pending]: "secondary",
  [OrderStatus.Processing]: "default",
  [OrderStatus.Shipped]: "outline",
  [OrderStatus.Delivered]: "outline",
  [OrderStatus.Cancelled]: "destructive",
};

// Small status pill for orders, shared by the overview, order list and detail.
export function StatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} className={className}>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
