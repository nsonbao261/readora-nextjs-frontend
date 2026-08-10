import { format } from "date-fns";

// Formats a price as Vietnamese Dong (189000 → "189.000 ₫").
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// Formats an ISO date string as "August 10, 2026".
export function formatDate(iso: string): string {
  return format(new Date(iso), "MMMM d, yyyy");
}
