import Image from "next/image";
import Link from "next/link";

import type { Book } from "@/types/book";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Rating } from "@/components/book/rating";
import { WishlistButton } from "@/components/book/wishlist-button";
import { cn } from "@/lib/utils";

// Formats a price as Vietnamese Dong (189000 → "189.000 ₫").
function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// Cover-first book card used in grids and the featured section. Cover and
// title link to `/book/[id]`; the wishlist button overlays the cover corner.
export function BookCard({
  book,
  className,
}: {
  book: Book;
  className?: string;
}) {
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
          <span className="text-sm font-medium">{formatPrice(book.price)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
