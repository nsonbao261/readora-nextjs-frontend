import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  type LucideIcon,
} from "lucide-react";

import type { CatalogState } from "@/lib/catalog";
import { buildCatalogUrl } from "@/lib/catalog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navClasses = buttonVariants({ variant: "outline", size: "icon" });

// Builds the numbered page list, inserting "ellipsis" markers wherever numbers
// are skipped so long ranges collapse (FR-4.2).
function buildPageList(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const candidates = new Set([1, totalPages, page - 1, page, page + 1]);
  const pages = [...candidates].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const list: (number | "ellipsis")[] = [];
  let previous = 0;
  for (const pageNumber of pages) {
    if (pageNumber - previous > 1) list.push("ellipsis");
    list.push(pageNumber);
    previous = pageNumber;
  }
  return list;
}

// One First/Prev/Next/Last button: a real next/link when enabled, a disabled
// span (aria-disabled) on the boundary pages.
function NavButton({
  href,
  disabled,
  label,
  icon: Icon,
}: {
  href: string;
  disabled: boolean;
  label: string;
  icon: LucideIcon;
}) {
  const className = cn(navClasses, disabled && "pointer-events-none opacity-50");
  if (disabled) {
    return (
      <span aria-disabled="true" className={className}>
        <Icon />
        <span className="sr-only">{label}</span>
      </span>
    );
  }
  return (
    <Link href={href} aria-label={label} className={className}>
      <Icon />
      <span className="sr-only">{label}</span>
    </Link>
  );
}

// Numbered pagination (FR-4.1/4.2/4.3). Renders real anchors built from
// buildCatalogUrl, so pages open normally and all other catalog state is
// preserved across page changes. First/Prev disabled on page 1, Next/Last
// disabled on the final page.
export function Pagination({
  page,
  totalPages,
  state,
}: {
  page: number;
  totalPages: number;
  state: CatalogState;
}) {
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1">
        <NavButton
          href={buildCatalogUrl(state, { page: 1 })}
          disabled={isFirst}
          label="Go to first page"
          icon={ChevronsLeftIcon}
        />
        <NavButton
          href={buildCatalogUrl(state, { page: Math.max(1, page - 1) })}
          disabled={isFirst}
          label="Go to previous page"
          icon={ChevronLeftIcon}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1">
        {buildPageList(page, totalPages).map((item, index) => {
          if (item === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                aria-hidden="true"
                className="px-1 text-sm text-muted-foreground"
              >
                …
              </span>
            );
          }
          if (item === page) {
            return (
              <span
                key={item}
                aria-current="page"
                className={cn(buttonVariants({ variant: "default", size: "icon" }))}
              >
                {item}
              </span>
            );
          }
          return (
            <Link
              key={item}
              href={buildCatalogUrl(state, { page: item })}
              aria-label={`Go to page ${item}`}
              className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
            >
              {item}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-1">
        <NavButton
          href={buildCatalogUrl(state, { page: Math.min(totalPages, page + 1) })}
          disabled={isLast}
          label="Go to next page"
          icon={ChevronRightIcon}
        />
        <NavButton
          href={buildCatalogUrl(state, { page: totalPages })}
          disabled={isLast}
          label="Go to last page"
          icon={ChevronsRightIcon}
        />
      </div>
    </nav>
  );
}
