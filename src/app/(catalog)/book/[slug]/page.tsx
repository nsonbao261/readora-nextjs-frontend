import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { books } from "@/data/books";
import { BADGE_LABELS, type BookBadge } from "@/types/book";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/book/rating";
import { CartActions } from "@/components/book/cart-actions";
import { WishlistButton } from "@/components/book/wishlist-button";
import { AddToCollectionButton } from "@/components/book/add-to-collection-button";
import { ShippingInfo } from "@/components/book/shipping-info";
import { SimilarBooks } from "@/components/book/similar-books";
import { ReviewsSection } from "@/components/book/reviews-section";
import { formatPrice, formatDate } from "@/lib/format";

// Maps a badge key to its pill style (mirrors `book-card`).
function badgeVariant(badge: BookBadge): "secondary" | "destructive" {
  return badge === "on-sale" ? "destructive" : "secondary";
}

// Per-book page metadata (title + synopsis) from the matched book.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = books.find((candidate) => candidate.id === slug);
  if (!book) {
    return { title: "Book not found | Readora" };
  }
  return { title: `${book.title} | Readora`, description: book.description };
}

// Server-rendered book detail page. Unknown slugs render the app's 404
// (FR-1.2); known books get a cover-first two-column hero, the action group,
// shipping info, similar books, and the reviews section.
export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = books.find((candidate) => candidate.id === slug);
  if (!book) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Cover column */}
        <div className="mx-auto w-full max-w-sm">
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl border bg-muted shadow-sm">
            <Image
              src={book.cover}
              alt={`${book.title} cover`}
              fill
              priority
              sizes="(min-width: 768px) 40vw, 80vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Info column */}
        <div className="flex flex-col gap-4">
          {book.badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {book.badges.map((badge) => (
                <Badge key={badge} variant={badgeVariant(badge)}>
                  {BADGE_LABELS[badge]}
                </Badge>
              ))}
            </div>
          )}

          <div>
            <h1 className="font-heading text-3xl font-medium tracking-tight text-balance sm:text-4xl">
              {book.title}
            </h1>
            <p className="mt-1 text-muted-foreground">
              by{" "}
              <span className="font-medium text-foreground">{book.author}</span>
            </p>
            {book.genres.length > 0 && (
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {book.genres.join(" · ")}
              </p>
            )}
          </div>

          <Rating rating={book.rating} ratingCount={book.ratingCount} />

          <p className="text-sm text-muted-foreground">
            Published {formatDate(book.publishedDate)}
          </p>

          <div className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-medium">
              {formatPrice(book.price)}
            </span>
            {book.originalPrice !== undefined && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(book.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground">{book.description}</p>

          <div className="mt-2 flex flex-col gap-2">
            <CartActions book={book} />
            <div className="flex flex-wrap gap-2">
              <WishlistButton
                bookTitle={book.title}
                label="Add to Wishlist"
                size="lg"
              />
              <AddToCollectionButton book={book} />
            </div>
          </div>

          <ShippingInfo subtotal={book.price} />
        </div>
      </div>

      <SimilarBooks book={book} />
      <ReviewsSection book={book} />
    </div>
  );
}
