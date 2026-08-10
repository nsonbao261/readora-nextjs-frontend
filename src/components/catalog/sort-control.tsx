"use client";

import { useRouter } from "next/navigation";
import { ArrowDownWideNarrowIcon, ArrowUpNarrowWideIcon } from "lucide-react";

import type { CatalogState, SortField } from "@/lib/catalog";
import { buildCatalogUrl, SORT_FIELDS } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sort field select + ascending/descending toggle (FR-2.1/2.3/2.4). Field and
// direction are controlled by the URL; every change pushes a new URL and resets
// the page to 1. The active field + direction stay visible in the control.
export function SortControl({ state }: { state: CatalogState }) {
  const router = useRouter();
  const isAscending = state.sortDir === "asc";
  const DirectionIcon = isAscending ? ArrowUpNarrowWideIcon : ArrowDownWideNarrowIcon;

  // Change the sort field via the select; ignore no-op and null selections.
  function handleFieldChange(value: SortField | null) {
    if (value === null || value === state.sortField) return;
    router.push(buildCatalogUrl(state, { sortField: value }));
  }

  // Flip the direction and keep the current field.
  function handleToggleDirection() {
    router.push(buildCatalogUrl(state, { sortDir: isAscending ? "desc" : "asc" }));
  }

  return (
    <div className="flex items-center gap-1.5">
      <Select value={state.sortField} onValueChange={handleFieldChange}>
        <SelectTrigger aria-label="Sort books by" className="min-w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {SORT_FIELDS.map((field) => (
            <SelectItem key={field.value} value={field.value}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleToggleDirection}
        aria-label={isAscending ? "Sort descending" : "Sort ascending"}
        title={isAscending ? "Sort descending" : "Sort ascending"}
      >
        <DirectionIcon />
      </Button>
    </div>
  );
}
