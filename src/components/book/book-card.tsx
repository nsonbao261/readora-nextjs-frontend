"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";
import { toast } from "sonner";

import type { Book, BookBadge } from "@/types/book";
import { BADGE_LABELS } from "@/types/book";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/book/rating";
import { WishlistButton } from "@/components/book/wishlist-button";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

// Maps a badge key to its pill style on the cover.
function badgeVariant(badge: BookBadge): "secondary" | "destructive" {
  return badge === "on-sale" ? "destructive" : "secondary";
}

// Cover-first book card used in grids and the featured section. Cover and
// title link to `/book/[id]`; the wishlist button overlays the cover's
// top-right and store-badge pills sit on the top-left.
export function BookCard({
  book,
  className,
}: {
  book: Book;
  className?: string;
}) {
  const addItem = useCartStore((state) => state.addItem);

  // Pushes the book into the cart store (increments if already present) and
  // confirms with a toast, mirroring the detail-page Add to Cart action.
  function handleAddToCart() {
    addItem({
      bookId: book.id,
      title: book.title,
      cover: book.cover,
      price: book.price,
    });
    toast.success(`Added "${book.title}" to your cart`);
  }

  return (
    <Card className={cn("group/book relative pt-0", className)}>
      <Link
        href={`/book/${book.id}`}
        className="relative block aspect-[2/3] overflow-hidden rounded-t-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Image
          src={book.cover}
          alt={`${book.title} cover`}
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="bg-muted object-cover transition-transform duration-500 group-hover/book:scale-105"
        />
      </Link>
      {book.badges.length > 0 && (
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
          {book.badges.map((badge) => (
            <Badge key={badge} variant={badgeVariant(badge)}>
              {BADGE_LABELS[badge]}
            </Badge>
          ))}
        </div>
      )}
      <div className="absolute top-2 right-2">
        <WishlistButton bookTitle={book.title} />
      </div>
      <CardContent className="flex flex-1 flex-col gap-2">
        <Link
          href={`/book/${book.id}`}
          className="rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <CardTitle className="line-clamp-1">{book.title}</CardTitle>
          <CardDescription>{book.author}</CardDescription>
        </Link>
        <Rating rating={book.rating} ratingCount={book.ratingCount} />
        <div className="mt-auto pt-1">
          {book.genres.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {book.genres.join(" · ")}
            </p>
          )}
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium">
                {formatPrice(book.price)}
              </span>
              {book.originalPrice !== undefined && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(book.originalPrice)}
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              aria-label={`Add ${book.title} to cart`}
              onClick={handleAddToCart}
            >
              <ShoppingCartIcon />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
