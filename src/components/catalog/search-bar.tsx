"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, XIcon } from "lucide-react";

import type { CatalogState } from "@/lib/catalog";
import { buildCatalogUrl } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Submit-based search (FR-1.2/1.3): Enter or the Search button pushes a new URL
// with `q` and resets the page to 1; the × clears the term and applies
// immediately (FR-1.4). Keeps other catalog state intact.
export function SearchBar({ state, className }: { state: CatalogState; className?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(state.q);

  // Apply the current term via URL navigation (page resets to 1).
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(buildCatalogUrl(state, { q: value }));
  }

  // Clear the term in both the input and the URL in one go.
  function handleClear() {
    setValue("");
    router.push(buildCatalogUrl(state, { q: "" }));
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("flex items-center gap-1.5", className)}
    >
      <div className="relative flex-1">
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search by title or author"
          aria-label="Search books by title or author"
          className="pr-8"
        />
        {value !== "" && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Clear search"
            onClick={handleClear}
            className="absolute top-1/2 right-1 -translate-y-1/2"
          >
            <XIcon />
          </Button>
        )}
      </div>
      <Button type="submit" size="icon" aria-label="Search">
        <SearchIcon />
      </Button>
    </form>
  );
}
