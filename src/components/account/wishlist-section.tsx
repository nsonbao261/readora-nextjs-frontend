"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import type { Book } from "@/types/book";
import { wishlistBookIds } from "@/data/wishlist";
import { books } from "@/data/books";
import { BookCard } from "@/components/book/book-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Dashboard wishlist: seeded book ids in local component state (deliberately
// NOT synced with the per-card WishlistButton, FR-6.3). Removing the last item
// shows an empty state linking back to the catalog (FR-6.1, 6.2).
export function WishlistSection() {
  const [ids, setIds] = useState<string[]>(wishlistBookIds);

  const wishlistBooks = ids
    .map((id) => books.find((book) => book.id === id))
    .filter((book): book is Book => book !== undefined);

  function handleRemove(bookId: string) {
    setIds((current) => current.filter((id) => id !== bookId));
    toast("Removed from your wishlist");
  }

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
          Account
        </p>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">
          Wishlist
        </h1>
        <p className="mt-2 text-muted-foreground">
          Books you&apos;ve saved for later.
        </p>
      </header>

      {wishlistBooks.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
          <div className="rounded-full border border-dashed border-border p-3">
            <HeartIcon className="size-6 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-xl font-medium">
            Your wishlist is empty
          </h2>
          <p className="text-muted-foreground">
            Browse the catalog and save books you love.
          </p>
          <Link href="/book" className={cn(buttonVariants({ variant: "outline" }))}>
            Browse books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {wishlistBooks.map((book) => (
            <div key={book.id}>
              <BookCard book={book} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(book.id)}
                className="mt-2 w-full cursor-pointer text-muted-foreground hover:text-destructive"
              >
                <XIcon />
                Remove from wishlist
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
