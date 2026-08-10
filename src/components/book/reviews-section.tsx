import { StarIcon } from "lucide-react";

import { reviewsBySlug } from "@/data/reviews";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Book } from "@/types/book";
import { Rating } from "@/components/book/rating";
import { ReviewForm } from "@/components/book/review-form";

// Static star row for a single review (no aggregate count).
function ReviewStars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon
          key={i}
          className={cn(
            "size-3.5",
            i < rating ? "fill-primary text-primary" : "text-muted-foreground/40",
          )}
        />
      ))}
    </span>
  );
}

// Reviews section for the detail page: header summary reusing `Rating`,
// the seeded review list, and the auth-gated review form. Books without
// seeded reviews get an empty state inviting the first review (FR-8.1/8.2).
export function ReviewsSection({ book }: { book: Book }) {
  const reviews = reviewsBySlug[book.id] ?? [];

  return (
    <section className="border-t pt-10">
      <div>
        <h2 className="font-heading text-2xl font-medium">Reviews</h2>
        <Rating
          rating={book.rating}
          ratingCount={book.ratingCount}
          className="mt-2"
        />
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">
            No reviews yet — be the first to write one.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {reviews.map((review) => (
              <li key={review.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{review.userName}</span>
                    <ReviewStars rating={review.rating} />
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {formatDate(review.date)}
                  </time>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {review.content}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="rounded-lg border p-4">
          <h3 className="font-heading text-lg font-medium">Write a review</h3>
          <ReviewForm bookTitle={book.title} />
        </div>
      </div>
    </section>
  );
}
