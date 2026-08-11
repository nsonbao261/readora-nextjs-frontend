"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/auth/form-field";
import { GoogleButton } from "@/components/auth/google-button";
import { resolveRedirect } from "@/components/auth/auth-utils";
import { useAuthStore } from "@/stores/auth-store";
import {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  DEMO_CUSTOMER_EMAIL,
  DEMO_CUSTOMER_PASSWORD,
} from "@/constants/auth";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

// Login form: credentials validated against the in-memory store, generic
// "Invalid email or password" error, demo hint, forgot-password link and a
// simulated Google sign-in (FR-4.1..4.5).
export function LoginForm({ redirect }: { redirect?: string }) {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  // Validates against the store; failure shows a single generic error so it
  // never reveals which field was wrong (FR-4.3).
  async function onSubmit(values: LoginValues) {
    const ok = login(values.email, values.password);
    if (!ok) {
      setError("root", { message: "Invalid email or password" });
      return;
    }
    const user = useAuthStore.getState().user;
    if (user) {
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      router.push(resolveRedirect(user, redirect));
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      {errors.root ? (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {errors.root.message}
        </p>
      ) : null}

      <FormField
        label="Email"
        htmlFor="login-email"
        error={errors.email?.message}
      >
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={errors.email ? true : undefined}
          {...register("email")}
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="login-password"
        error={errors.password?.message}
      >
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Your password"
            aria-invalid={errors.password ? true : undefined}
            className="pr-9"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {showPassword ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </button>
        </div>
      </FormField>

      <div className="flex justify-end">
        <Link
          href="/forget-password"
          className="text-xs text-primary underline-offset-4 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
        {isSubmitting ? "Logging in…" : "Log in"}
      </Button>

      <div className="my-1 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton redirect={redirect} />

      <div className="rounded-md border border-dashed border-border p-3">
        <p className="text-xs font-medium">Demo accounts</p>
        <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Admin</span> —{" "}
            {DEMO_ADMIN_EMAIL} / {DEMO_ADMIN_PASSWORD}
          </li>
          <li>
            <span className="font-medium text-foreground">Customer</span> —{" "}
            {DEMO_CUSTOMER_EMAIL} / {DEMO_CUSTOMER_PASSWORD}
          </li>
        </ul>
      </div>
    </form>
  );
}
