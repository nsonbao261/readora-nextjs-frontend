import { OrderStatus } from "@/types/order";

// Human-readable labels for order statuses (used in badges, lists, timeline).
export const ORDER_STATUS_LABELS: { [K in OrderStatus]: string } = {
  [OrderStatus.Pending]: "Pending",
  [OrderStatus.Processing]: "Processing",
  [OrderStatus.Shipped]: "Shipped",
  [OrderStatus.Delivered]: "Delivered",
  [OrderStatus.Cancelled]: "Cancelled",
};

// The forward progress flow shown in the order-detail timeline; a cancelled
// order short-circuits to a distinct cancelled state instead.
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  OrderStatus.Pending,
  OrderStatus.Processing,
  OrderStatus.Shipped,
  OrderStatus.Delivered,
];

// Statuses at which a customer may still cancel an order (pre-shipment).
export const CANCELLABLE_STATUSES: OrderStatus[] = [
  OrderStatus.Pending,
  OrderStatus.Processing,
];
