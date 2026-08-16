"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBagIcon } from "lucide-react";

import type { CartItem } from "@/stores/cart-store";
import { selectSubtotal } from "@/stores/cart-store";
import { useAuthStore, selectIsAuthenticated } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoginGateDialog } from "@/components/shared/login-gate-dialog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

// Order summary card shown beside the line items: items subtotal + Total
// Price (VND), a login-gated Checkout button, and a Continue Shopping link
// back to the catalog. Hidden entirely in the empty state (FR-5.3).
export function CartSummary({
  items,
  className,
}: {
  items: CartItem[];
  className?: string;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const subtotal = selectSubtotal(items);
  const [loginGateOpen, setLoginGateOpen] = useState(false);

  // Routes signed-in users to checkout; guests get the login-gate dialog.
  function handleCheckout() {
    if (!isAuthenticated) {
      setLoginGateOpen(true);
      return;
    }
    router.push("/checkout");
  }

  return (
    <div className={cn("rounded-xl border border-border p-6", className)}>
      <h2 className="font-heading text-lg font-medium">Summary</h2>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Items subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Price</span>
          <span className="font-heading text-xl font-medium">
            {formatPrice(subtotal)}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Button size="lg" className="w-full cursor-pointer" onClick={handleCheckout}>
          <ShoppingBagIcon />
          Checkout
        </Button>
        <Button variant="ghost" className="w-full cursor-pointer" render={<Link href="/book" />}>
          Continue Shopping
        </Button>
      </div>

      <LoginGateDialog
        open={loginGateOpen}
        onOpenChange={setLoginGateOpen}
        description="Log in to continue to checkout."
      />
    </div>
  );
}
