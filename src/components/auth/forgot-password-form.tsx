"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/auth/form-field";
import { useResendCooldown } from "@/components/auth/use-resend-cooldown";

const emailSchema = z.object({
  email: z.email("Enter a valid email address"),
});

type EmailValues = z.infer<typeof emailSchema>;

// Forgot-password flow: step 1 requests an email, step 2 shows the simulated
// "check your email" confirmation with a resend cooldown and a back link
// (FR-6.1..6.4). No password is actually reset.
export function ForgotPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const { secondsLeft, canResend, reset } = useResendCooldown();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailValues>({ resolver: zodResolver(emailSchema) });

  function onSubmit(values: EmailValues) {
    setSubmittedEmail(values.email);
    toast("If the account exists, a reset link is on its way");
  }

  function handleResend() {
    reset();
    toast("A new reset link was sent");
  }

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
          {submittedEmail ? (
            <div className="flex flex-col gap-4 text-center">
              <h1 className="font-heading text-xl">Check your email</h1>
              <p className="text-sm leading-6 text-muted-foreground">
                If an account exists for{" "}
                <span className="font-medium text-foreground">
                  {submittedEmail}
                </span>
                , we&apos;ve sent you a link to reset your password. It also
                works to just close this page — we only simulate sending.
              </p>
              <Button
                variant="outline"
                className="cursor-pointer"
                disabled={!canResend}
                onClick={handleResend}
              >
                {canResend ? "Resend email" : `Resend in ${secondsLeft}s`}
              </Button>
              <Link
                href="/auth?mode=login"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
              noValidate
            >
              <div>
                <h1 className="font-heading text-xl">Forgot your password?</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <FormField
                label="Email"
                htmlFor="forgot-email"
                error={errors.email?.message}
              >
                <Input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={errors.email ? true : undefined}
                  {...register("email")}
                />
              </FormField>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting ? "Sending…" : "Send reset link"}
              </Button>

              <Link
                href="/auth?mode=login"
                className="text-center text-sm text-primary underline-offset-4 hover:underline"
              >
                Back to login
              </Link>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
