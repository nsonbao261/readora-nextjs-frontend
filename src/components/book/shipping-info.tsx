import { TruckIcon } from "lucide-react";

import { formatPrice } from "@/lib/format";
import {
  SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
} from "@/constants/shipping";

// Flat-fee shipping row for the detail page. Free shipping applies once the
// subtotal (the single book price here) meets the threshold; otherwise it
// shows the fee plus the amount still needed for free shipping (FR-5.1/5.2).
export function ShippingInfo({ subtotal }: { subtotal: number }) {
  const amountToFree = FREE_SHIPPING_THRESHOLD - subtotal;
  const qualifies = amountToFree <= 0;

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm">
      <TruckIcon className="size-4 text-primary" />
      {qualifies ? (
        <p>
          <span className="font-medium">Free shipping</span> on this order.
        </p>
      ) : (
        <p>
          <span className="font-medium">{formatPrice(SHIPPING_FEE)}</span>{" "}
          shipping · add{" "}
          <span className="font-medium">{formatPrice(amountToFree)}</span> more
          for free shipping.
        </p>
      )}
    </div>
  );
}
