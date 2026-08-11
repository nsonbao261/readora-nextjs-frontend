"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";
import { useResendCooldown } from "@/components/auth/use-resend-cooldown";
import { authHref, resolveRedirect } from "@/components/auth/auth-utils";
import { DEMO_VERIFICATION_CODE } from "@/constants/auth";

// Email verification step after registration. A single 6-digit numeric input;
// the demo code is surfaced on screen so the flow is demonstrable. Correct
// code verifies + signs in, wrong code errors + clears (FR-3.1..3.6).
export function EmailVerification({
  userId,
  email,
  redirect,
}: {
  userId: string;
  email: string;
  redirect?: string;
}) {
  const router = useRouter();
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const { secondsLeft, canResend, reset } = useResendCooldown();
  const [code, setCode] = useState("");
  const [verificationCode, setVerificationCode] = useState(
    DEMO_VERIFICATION_CODE,
  );
  const [error, setError] = useState<string | null>(null);

  // Verifies the entered code; on success signs the user in, toasts and
  // navigates to the redirect target (FR-3.3).
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code !== verificationCode) {
      setError("That code doesn't match. Check the demo code and try again.");
      setCode("");
      return;
    }
    verifyEmail(userId);
    const user = useAuthStore.getState().user;
    if (user) {
      toast.success("Email verified — welcome!");
      router.push(resolveRedirect(user, redirect));
    }
  }

  // Resends the (demo) code and restarts the cooldown (FR-3.5).
  function handleResend() {
    setVerificationCode(DEMO_VERIFICATION_CODE);
    setCode("");
    setError(null);
    reset();
    toast("A new code was sent");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      noValidate
    >
      <div className="text-center">
        <h1 className="font-heading text-xl">Verify your email</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="verification-code"
          className="text-sm font-medium"
        >
          Verification code
        </label>
        <Input
          id="verification-code"
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
          placeholder="6 digits"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          aria-invalid={error !== null}
          aria-describedby={error ? "verification-error" : undefined}
          className="text-center font-mono text-lg tracking-[0.5em]"
        />
        {error ? (
          <p
            id="verification-error"
            role="alert"
            className="text-xs text-destructive"
          >
            {error}
          </p>
        ) : null}
      </div>

      <p className="rounded-md bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
        Demo mode — your code is{" "}
        <span className="font-mono font-medium tracking-widest text-foreground">
          {verificationCode}
        </span>
      </p>

      <Button type="submit" className="cursor-pointer">
        Verify & sign in
      </Button>

      <button
        type="button"
        onClick={handleResend}
        disabled={!canResend}
        className="cursor-pointer text-center text-sm text-primary underline-offset-4 hover:underline disabled:pointer-events-none disabled:text-muted-foreground disabled:no-underline"
      >
        {canResend
          ? "Resend code"
          : `Resend code in ${secondsLeft}s`}
      </button>

      <Link
        href={authHref("login", redirect)}
        className="text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Back to login
      </Link>
    </form>
  );
}
