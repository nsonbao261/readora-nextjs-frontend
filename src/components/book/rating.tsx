import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Compacts a rating count into a readable label (1284 → "1.3k", 512 → "512").
function formatRatingCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(count);
}

// Star row + numeric rating/count for a book. Renders 5 stars, filling them
// to the nearest whole rating.
export function Rating({
  rating,
  ratingCount,
  className,
}: {
  rating: number;
  ratingCount: number;
  className?: string;
}) {
  const filled = Math.round(rating);

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon
            key={i}
            className={cn(
              "size-3.5",
              i < filled
                ? "fill-primary text-primary"
                : "text-muted-foreground/40",
            )}
          />
        ))}
      </span>
      <span className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
        {" · "}
        {formatRatingCount(ratingCount)}
      </span>
    </div>
  );
}
