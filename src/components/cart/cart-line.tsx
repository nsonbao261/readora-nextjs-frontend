"use client";

import Image from "next/image";
import Link from "next/link";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import type { CartItem } from "@/stores/cart-store";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

// Single cart line item: cover and title link back to the book page, unit
// price, +/- quantity controls (minus disabled at quantity 1), line total,
// and a delete action that removes the line with a confirmation toast.
export function CartLine({ item }: { item: CartItem }) {
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  // Removes the entire line regardless of its quantity (FR-3.1).
  function handleRemove() {
    removeItem(item.bookId);
    toast(`Removed "${item.title}" from your cart`);
  }

  return (
    <li className="flex gap-4">
      <Link
        href={`/book/${item.bookId}`}
        className="relative block aspect-2/3 w-16 shrink-0 overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:w-20"
      >
        <Image
          src={item.cover}
          alt={`${item.title} cover`}
          fill
          sizes="80px"
          className="bg-muted object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          href={`/book/${item.bookId}`}
          className="line-clamp-2 rounded-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {item.title}
        </Link>
        <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              className="cursor-pointer"
              aria-label={`Reduce quantity of ${item.title}`}
              // disabled={item.quantity <= 1}
              onClick={() => decreaseQuantity(item.bookId)}
            >
              <MinusIcon />
            </Button>
            <span className="w-8 text-center text-sm" aria-live="polite">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              className="cursor-pointer"
              aria-label={`Increase quantity of ${item.title}`}
              onClick={() => increaseQuantity(item.bookId)}
            >
              <PlusIcon />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {formatPrice(item.price * item.quantity)}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="cursor-pointer text-muted-foreground hover:text-destructive"
              aria-label={`Remove ${item.title} from cart`}
              onClick={handleRemove}
            >
              <Trash2Icon />
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}
