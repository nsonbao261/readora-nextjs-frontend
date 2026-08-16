"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  authHref,
  authHrefFromCurrent,
  type AuthMode,
} from "@/components/auth/auth-utils";

// Auth link that preserves the current page (path + search) as the post-auth
// redirect so users return where they left off. The href is computed at click
// time (so it is always the page the user is actually on) and rendered as the
// plain /auth href for prefetch + modified clicks (middle/ctrl/cmd open the
// auth page without a redirect).
export function AuthLink({
  mode,
  className,
  children,
}: {
  mode: AuthMode;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();

  // Regular clicks navigate with the current page as the redirect target;
  // modified clicks (new tab etc.) fall back to the plain /auth href.
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    const { pathname, search } = window.location;
    event.preventDefault();
    router.push(authHrefFromCurrent(mode, pathname, search));
  }

  return (
    <Link href={authHref(mode)} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
