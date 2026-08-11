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

// Role-aware post-auth redirect: admins always land on /admin; customers go
// to the redirect param or the default home (FR-1.4, FR-7.7).
export function resolveRedirect(user: User, redirectParam?: string): string {
  if (user.role === "admin") return "/admin";
  return redirectParam || DEFAULT_REDIRECT;
}
