import type { Address } from "@/types/address";

// Lifecycle of an order; `cancelled` is terminal and stops the normal flow.
export enum OrderStatus {
  Pending = "pending",
  Processing = "processing",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

// Snapshot of a purchased book at order time (titles/covers/prices are
// frozen so history is stable even if the catalog changes).
export type OrderItem = {
  bookId: string;
  title: string;
  cover: string;
  price: number;
  quantity: number;
};

// A placed order; totals are stored as snapshots, not recomputed live.
export type Order = {
  id: string;
  // ISO date string (e.g. "2026-07-20T09:30:00.000Z").
  placedAt: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  // Address copied at checkout time (immutable history).
  shippingAddress: Address;
};
