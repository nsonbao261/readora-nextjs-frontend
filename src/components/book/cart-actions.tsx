"use client";

import { useRouter } from "next/navigation";
import { ShoppingCartIcon, ZapIcon } from "lucide-react";
import { toast } from "sonner";

import type { Book } from "@/types/book";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";

// Buy Now / Add to Cart button group for the detail page. Both actions add
// the book to the cart store; Buy Now additionally navigates to `/checkout`.
export function CartActions({ book }: { book: Book }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  // Pushes the book into the cart store (increments if already present).
  function handleAddToCart() {
    addItem({
      bookId: book.id,
      title: book.title,
      cover: book.cover,
      price: book.price,
    });
    toast.success(`Added "${book.title}" to your cart`);
  }

  // Adds the book, then sends the user straight to checkout (FR-2.1).
  function handleBuyNow() {
    handleAddToCart();
    router.push("/checkout");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="lg" className="cursor-pointer" onClick={handleBuyNow}>
        <ZapIcon />
        Buy Now
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="cursor-pointer"
        onClick={handleAddToCart}
      >
        <ShoppingCartIcon />
        Add to Cart
      </Button>
    </div>
  );
}
