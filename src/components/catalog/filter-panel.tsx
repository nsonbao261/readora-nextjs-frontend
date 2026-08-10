"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import type { BookBadge } from "@/types/book";
import type { CatalogState, PublishedIn } from "@/lib/catalog";
import {
  BADGES,
  buildCatalogUrl,
  countActiveFilters,
  PUBLISHED_IN_OPTIONS,
} from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Parses a price input value into a non-negative number, or undefined if blank.
function parsePrice(value: string): number | undefined {
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

// Draft-state filter form (FR-3.6/3.7/3.8): checkboxes, price inputs, and the
// date preset edit local state only; Apply validates Min ≤ Max then pushes the
// URL (page resets), while Clear all resets and applies immediately.
export function FilterPanel({
  state,
  genres,
  className,
}: {
  state: CatalogState;
  genres: string[];
  className?: string;
}) {
  const router = useRouter();
  const [draftGenres, setDraftGenres] = useState<string[]>(state.genres);
  const [draftBadges, setDraftBadges] = useState<BookBadge[]>(state.badges);
  const [priceMin, setPriceMin] = useState(state.priceMin?.toString() ?? "");
  const [priceMax, setPriceMax] = useState(state.priceMax?.toString() ?? "");
  const [publishedIn, setPublishedIn] = useState<PublishedIn>(state.publishedIn);
  const [showError, setShowError] = useState(false);

  const activeFilterCount = countActiveFilters(state);

  // Add/remove a genre from the draft selection (OR within the group).
  function toggleGenre(genre: string) {
    setDraftGenres((current) =>
      current.includes(genre) ? current.filter((g) => g !== genre) : [...current, genre],
    );
  }

  // Add/remove a badge from the draft selection (OR within the group).
  function toggleBadge(badge: BookBadge) {
    setDraftBadges((current) =>
      current.includes(badge) ? current.filter((b) => b !== badge) : [...current, badge],
    );
  }

  // Validate the draft and push it as the applied URL state.
  function handleApply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const min = parsePrice(priceMin);
    const max = parsePrice(priceMax);
    const hasInvalidNumber =
      (priceMin.trim() !== "" && min === undefined) ||
      (priceMax.trim() !== "" && max === undefined);
    if (hasInvalidNumber || (min !== undefined && max !== undefined && min > max)) {
      setShowError(true);
      return;
    }
    setShowError(false);
    router.push(
      buildCatalogUrl(state, {
        genres: draftGenres,
        badges: draftBadges,
        priceMin: min,
        priceMax: max,
        publishedIn,
      }),
    );
  }

  // Reset every filter to its default and apply immediately.
  function handleClearAll() {
    setDraftGenres([]);
    setDraftBadges([]);
    setPriceMin("");
    setPriceMax("");
    setPublishedIn("any");
    setShowError(false);
    router.push(
      buildCatalogUrl(state, {
        genres: [],
        badges: [],
        priceMin: undefined,
        priceMax: undefined,
        publishedIn: "any",
      }),
    );
  }

  const groupLabel = "text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground";

  return (
    <form
      onSubmit={handleApply}
      className={cn("flex flex-col gap-5 rounded-xl border p-4", className)}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-medium">Filters</h2>
        <button
          type="button"
          onClick={handleClearAll}
          className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          Clear all
        </button>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className={groupLabel}>Price</legend>
        <div className="flex items-center gap-2">
          <div className="flex flex-1 flex-col gap-1">
            <Label htmlFor="price-min" className="sr-only">
              Minimum price
            </Label>
            <Input
              id="price-min"
              type="text"
              inputMode="numeric"
              value={priceMin}
              onChange={(event) => setPriceMin(event.target.value)}
              placeholder="Min"
              className="h-7"
            />
          </div>
          <span aria-hidden="true" className="text-muted-foreground">
            –
          </span>
          <div className="flex flex-1 flex-col gap-1">
            <Label htmlFor="price-max" className="sr-only">
              Maximum price
            </Label>
            <Input
              id="price-max"
              type="text"
              inputMode="numeric"
              value={priceMax}
              onChange={(event) => setPriceMax(event.target.value)}
              placeholder="Max"
              className="h-7"
            />
          </div>
        </div>
        {showError && (
          <p role="alert" className="text-xs text-destructive">
            Enter a valid price range where Min is not greater than Max.
          </p>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className={groupLabel}>Genre</legend>
        {genres.map((genre) => (
          <div key={genre} className="flex items-center gap-2">
            <Checkbox
              id={`genre-${genre}`}
              checked={draftGenres.includes(genre)}
              onCheckedChange={() => toggleGenre(genre)}
            />
            <Label htmlFor={`genre-${genre}`}>{genre}</Label>
          </div>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className={groupLabel}>Badges</legend>
        {BADGES.map((badge) => (
          <div key={badge.value} className="flex items-center gap-2">
            <Checkbox
              id={`badge-${badge.value}`}
              checked={draftBadges.includes(badge.value)}
              onCheckedChange={() => toggleBadge(badge.value)}
            />
            <Label htmlFor={`badge-${badge.value}`}>{badge.label}</Label>
          </div>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className={groupLabel}>Published</legend>
        <Select
          value={publishedIn}
          onValueChange={(value) => {
            if (value !== null) setPublishedIn(value as PublishedIn);
          }}
        >
          <SelectTrigger aria-label="Published date" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PUBLISHED_IN_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </fieldset>

      <div className="border-t pt-4">
        <Button type="submit" className="w-full">
          Apply
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-4 px-1 text-[0.7rem] tabular-nums">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>
    </form>
  );
}
