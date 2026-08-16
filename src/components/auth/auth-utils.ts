import type { User } from "@/types/user";
import { DEFAULT_REDIRECT } from "@/constants/auth";

// Auth modes exposed by the /auth route (FR-1.1).
export type AuthMode = "login" | "register";

// Builds a /auth href carrying the mode plus an optional redirect target so
// it survives mode switches (FR-1.2/1.4).
export function authHref(mode: AuthMode, redirect?: string): string {
  const params = new URLSearchParams();
  params.set("mode", mode);
  if (redirect) params.set("redirect", redirect);
  const query = params.toString();
  return query ? `/auth?${query}` : "/auth";
}

// Builds a /auth href that carries the current page (path + search) as the
// redirect target, so users return to where they left off after signing in.
export function authHrefFromCurrent(
  mode: AuthMode,
  pathname: string,
  search: string,
): string {
  return authHref(mode, `${pathname}${search}`);
}

// Role-aware post-auth redirect: admins always land on /admin; customers go
// to the redirect param (internal paths only, avoiding open redirects) or the
// default home (FR-1.4, FR-7.7).
export function resolveRedirect(user: User, redirectParam?: string): string {
  if (user.role === "admin") return "/admin";
  if (redirectParam?.startsWith("/") && !redirectParam.startsWith("//")) {
    return redirectParam;
  }
  return DEFAULT_REDIRECT;
}
