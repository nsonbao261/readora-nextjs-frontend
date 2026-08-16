"use client";

import { useCartStore, selectCount } from "@/stores/cart-store";
import { CartLine } from "@/components/cart/cart-line";
import { CartSummary } from "@/components/cart/cart-summary";
import { CartEmpty } from "@/components/cart/cart-empty";

// Cart page: line-item list (left) + order summary (right). Renders the
// empty state instead when the cart has no items (FR-5.1). All cart state
// is read live from the cart-store, so totals and the navbar badge stay in
// sync with every add/increase/reduce/remove (FR-2.4).
export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const count = useCartStore((state) => selectCount(state.items));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-12 pb-24 sm:px-6 sm:pt-16">
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
          Cart
        </p>
        <h1 className="mt-1 font-heading text-3xl font-medium tracking-tight text-balance sm:text-4xl">
          Your cart
        </h1>
        <p className="mt-2 text-muted-foreground">
          {count === 1 ? "1 book ready to ship" : `${count} books ready to ship`}
        </p>
      </header>

      {items.length === 0 ? (
        <CartEmpty />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="flex flex-col gap-6">
            {items.map((item) => (
              <CartLine key={item.bookId} item={item} />
            ))}
          </ul>
          <CartSummary items={items} className="lg:sticky lg:top-24 lg:self-start" />
        </div>
      )}
    </div>
  );
}
