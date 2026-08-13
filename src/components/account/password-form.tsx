"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EyeIcon, EyeOffIcon, InfoIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/auth/form-field";
import { useAuthStore } from "@/stores/auth-store";
import { PASSWORD_REGEX } from "@/constants/auth";

const passwordSchema = z
  .object({
    current: z.string().min(1, "Current password is required"),
    next: z
      .string()
      .regex(
        PASSWORD_REGEX,
        "Password needs 8+ characters with at least one letter and one number",
      ),
    confirm: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.next === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type PasswordValues = z.infer<typeof passwordSchema>;

// Visibility toggle for a password input (mirrors the auth forms).
function PasswordToggleButton({
  visible,
  onToggle,
  label,
}: {
  visible: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {visible ? (
        <EyeOffIcon className="size-4" />
      ) : (
        <EyeIcon className="size-4" />
      )}
    </button>
  );
}

// Password management: current/new/confirm with visibility toggles. Validates
// against the in-memory credential map via auth-store.changePassword; a wrong
// current password shows an inline error (no lockout). Google accounts have no
// stored password, so they get a notice + a disabled form (FR-4.1..4.5).
export function PasswordForm() {
  const user = useAuthStore((state) => state.user);
  const changePassword = useAuthStore((state) => state.changePassword);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current: "", next: "", confirm: "" },
  });

  const isGoogle = user?.provider === "google";

  // Wrong current password → inline error on that field; success resets the
  // form so the new password can't be re-submitted (FR-4.3/4.4).
  function onSubmit(values: PasswordValues) {
    const ok = changePassword(values.current, values.next);
    if (!ok) {
      setError("current", { message: "Current password is incorrect" });
      return;
    }
    toast.success("Password updated");
    reset();
  }

  return (
    <div className="max-w-2xl">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
          Account
        </p>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">
          Password
        </h1>
        <p className="mt-2 text-muted-foreground">
          Choose a new password to keep your account secure.
        </p>
      </header>

      {isGoogle ? (
        <Alert className="mb-6">
          <InfoIcon />
          <AlertTitle>Password sign-in unavailable</AlertTitle>
          <AlertDescription>
            Your account signs in with Google, so no password is stored here.
            Manage your Google account password to keep signing in with Google.
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            <fieldset
              disabled={isGoogle}
              className="flex flex-col gap-4"
              aria-disabled={isGoogle || undefined}
            >
              <FormField
                label="Current password"
                htmlFor="pw-current"
                error={errors.current?.message}
              >
                <div className="relative">
                  <Input
                    id="pw-current"
                    type={showCurrent ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Your current password"
                    aria-invalid={errors.current ? true : undefined}
                    className="pr-9"
                    {...register("current")}
                  />
                  <PasswordToggleButton
                    visible={showCurrent}
                    onToggle={() => setShowCurrent((visible) => !visible)}
                    label={showCurrent ? "Hide current password" : "Show current password"}
                  />
                </div>
              </FormField>

              <FormField
                label="New password"
                htmlFor="pw-new"
                error={errors.next?.message}
              >
                <div className="relative">
                  <Input
                    id="pw-new"
                    type={showNext ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="8+ chars, letters & numbers"
                    aria-invalid={errors.next ? true : undefined}
                    className="pr-9"
                    {...register("next")}
                  />
                  <PasswordToggleButton
                    visible={showNext}
                    onToggle={() => setShowNext((visible) => !visible)}
                    label={showNext ? "Hide new password" : "Show new password"}
                  />
                </div>
              </FormField>

              <FormField
                label="Confirm new password"
                htmlFor="pw-confirm"
                error={errors.confirm?.message}
              >
                <div className="relative">
                  <Input
                    id="pw-confirm"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat your new password"
                    aria-invalid={errors.confirm ? true : undefined}
                    className="pr-9"
                    {...register("confirm")}
                  />
                  <PasswordToggleButton
                    visible={showConfirm}
                    onToggle={() => setShowConfirm((visible) => !visible)}
                    label={showConfirm ? "Hide confirmation" : "Show confirmation"}
                  />
                </div>
              </FormField>
            </fieldset>

            <div className="mt-2 flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || isGoogle}
                className="cursor-pointer"
              >
                {isSubmitting ? "Updating…" : "Update password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
