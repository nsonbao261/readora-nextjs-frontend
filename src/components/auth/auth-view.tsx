"use client";

import Link from "next/link";

import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { authHref, type AuthMode } from "@/components/auth/auth-utils";
import { cn } from "@/lib/utils";

// Tab link inside the segmented mode switcher (updates the URL so modes stay
// shareable/bookmarkable, FR-1.2).
function ModeTab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: string;
}) {
  return (
    <Link
      href={href}
      role="tab"
      aria-selected={active}
      className={cn(
        "rounded-md px-3 py-1.5 text-center text-sm font-medium transition-colors",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

// Auth shell for /auth: brand wordmark, Login/Sign up tab switcher, the active
// mode's form, and a mode-switch prompt. `redirect` is threaded through every
// link so it survives switching (FR-1.1/1.2/1.4, FR-4.4).
export function AuthView({
  mode,
  redirect,
}: {
  mode: AuthMode;
  redirect?: string;
}) {
  const loginHref = authHref("login", redirect);
  const registerHref = authHref("register", redirect);

  return (
    <div className="flex min-h-[calc(100dvh-8rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 block text-center font-heading text-2xl font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Readora
        </Link>

        <Card className="p-6">
          <div
            role="tablist"
            aria-label="Authentication mode"
            className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
          >
            <ModeTab href={loginHref} active={mode === "login"}>
              Log in
            </ModeTab>
            <ModeTab href={registerHref} active={mode === "register"}>
              Sign up
            </ModeTab>
          </div>

          {mode === "login" ? (
            <LoginForm redirect={redirect} />
          ) : (
            <RegisterForm redirect={redirect} />
          )}

          <div className="mt-6 border-t border-border pt-4 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <Link
                  href={registerHref}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href={loginHref}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export type { AuthMode };
