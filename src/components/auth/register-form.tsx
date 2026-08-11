"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { differenceInYears, isValid, subYears } from "date-fns";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/auth/form-field";
import { GoogleButton } from "@/components/auth/google-button";
import { DatePickerField } from "@/components/auth/date-picker-field";
import { EmailVerification } from "@/components/auth/email-verification";
import { useAuthStore } from "@/stores/auth-store";
import {
  MAX_AGE,
  MIN_AGE,
  PASSWORD_REGEX,
  PHONE_REGEX,
} from "@/constants/auth";

// Date-of-birth schema: an ISO date string from the picker that must be a real
// date with an age between MIN_AGE and MAX_AGE. The picker disables out-of-range
// days, this re-checks as a safety net.
const dateOfBirthSchema = z
  .string()
  .min(1, "Date of birth is required")
  .superRefine((value, ctx) => {
    const parsed = new Date(`${value}T00:00:00`);
    if (!isValid(parsed)) {
      ctx.addIssue({ code: "custom", message: "Pick a valid date" });
      return;
    }
    const age = differenceInYears(new Date(), parsed);
    if (age < MIN_AGE) {
      ctx.addIssue({
        code: "custom",
        message: `You must be at least ${MIN_AGE} years old`,
      });
    } else if (age > MAX_AGE) {
      ctx.addIssue({
        code: "custom",
        message: `Age must be ${MAX_AGE} or younger`,
      });
    }
  });

const registerSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.email("Enter a valid email address"),
    password: z
      .string()
      .regex(
        PASSWORD_REGEX,
        "Password needs 8+ characters with at least one letter and one number",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    dateOfBirth: dateOfBirthSchema,
    phone: z
      .string()
      .regex(PHONE_REGEX, "Enter a VN mobile number (10 digits starting with 0)"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

const defaultValues: RegisterValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  dateOfBirth: "",
  phone: "",
};

// Register form: validates all 6 fields with inline errors, creates an
// unverified customer in the store, then hands off to the email-verification
// step (FR-2.1..2.5, FR-5.1).
export function RegisterForm({ redirect }: { redirect?: string }) {
  const registerAccount = useAuthStore((state) => state.register);
  const [registeredUser, setRegisteredUser] = useState<{
    id: string;
    email: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  // Creates the account (not signed in yet) and transitions to verification.
  function onSubmit(values: RegisterValues) {
    const user = registerAccount({
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      dateOfBirth: values.dateOfBirth,
    });
    toast.success("Account created — check your email for the code");
    setRegisteredUser({ id: user.id, email: user.email });
  }

  if (registeredUser) {
    return (
      <EmailVerification
        userId={registeredUser.id}
        email={registeredUser.email}
        redirect={redirect}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <FormField
        label="Full name"
        htmlFor="register-name"
        error={errors.name?.message}
      >
        <Input
          id="register-name"
          autoComplete="name"
          placeholder="Jane Doe"
          aria-invalid={errors.name ? true : undefined}
          {...register("name")}
        />
      </FormField>

      <FormField
        label="Email"
        htmlFor="register-email"
        error={errors.email?.message}
      >
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={errors.email ? true : undefined}
          {...register("email")}
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="register-password"
        error={errors.password?.message}
      >
        <div className="relative">
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="8+ chars, letters & numbers"
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

      <FormField
        label="Confirm password"
        htmlFor="register-confirm"
        error={errors.confirmPassword?.message}
      >
        <div className="relative">
          <Input
            id="register-confirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your password"
            aria-invalid={errors.confirmPassword ? true : undefined}
            className="pr-9"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((visible) => !visible)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {showConfirm ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </button>
        </div>
      </FormField>

      <FormField
        label="Date of birth"
        htmlFor="register-dob"
        error={errors.dateOfBirth?.message}
      >
        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field }) => (
            <DatePickerField
              id="register-dob"
              value={field.value}
              onChange={field.onChange}
              minDate={subYears(new Date(), MAX_AGE)}
              maxDate={subYears(new Date(), MIN_AGE)}
            />
          )}
        />
      </FormField>

      <FormField
        label="Phone number"
        htmlFor="register-phone"
        error={errors.phone?.message}
      >
        <Input
          id="register-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0912345678"
          aria-invalid={errors.phone ? true : undefined}
          {...register("phone")}
        />
      </FormField>

      <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>

      <div className="my-1 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton redirect={redirect} />
    </form>
  );
}
