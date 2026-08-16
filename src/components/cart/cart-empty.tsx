"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

// Empty-cart state shown instead of the item list and summary (FR-5.1): a
// quiet message plus a CTA back to the catalog (FR-5.2).
export function CartEmpty() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
      <ShoppingCartIcon className="size-8 text-muted-foreground" />
      <h2 className="font-heading text-xl font-medium">Your cart is empty</h2>
      <p className="text-muted-foreground">
        Browse the shelves and add a book or two.
      </p>
      <Link
        href="/book"
        className={buttonVariants({ variant: "outline" })}
      >
        Browse books
      </Link>
    </div>
  );
}
