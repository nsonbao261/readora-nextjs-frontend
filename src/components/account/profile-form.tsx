"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { differenceInYears, isValid, subYears } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/auth/form-field";
import { DatePickerField } from "@/components/auth/date-picker-field";
import { useAuthStore } from "@/stores/auth-store";
import { MAX_AGE, MIN_AGE, PHONE_REGEX } from "@/constants/auth";

// Date-of-birth schema: an ISO date string that must be a real date with an
// age between MIN_AGE and MAX_AGE (same rule as registration; the picker also
// disables out-of-range days as a first line of defence).
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

const profileSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z
    .string()
    .regex(PHONE_REGEX, "Enter a VN mobile number (10 digits starting with 0)"),
  dateOfBirth: dateOfBirthSchema,
});

type ProfileValues = z.infer<typeof profileSchema>;

// Editable profile form (name/phone/dob; email is read-only). Prefilled from
// the signed-in user and saved via auth-store.updateProfile so the navbar
// avatar stays in sync; every save fires a toast (FR-3.1..3.3).
export function ProfileForm() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      dateOfBirth: user?.dateOfBirth ?? "",
    },
  });

  function onSubmit(values: ProfileValues) {
    updateProfile(values);
    toast.success("Profile updated");
  }

  return (
    <div className="max-w-2xl">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
          Account
        </p>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">
          Profile
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your personal details, used across checkout and order history.
        </p>
      </header>

      <Card>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            <FormField
              label="Full name"
              htmlFor="profile-name"
              error={errors.name?.message}
            >
              <Input
                id="profile-name"
                autoComplete="name"
                placeholder="Jane Doe"
                aria-invalid={errors.name ? true : undefined}
                {...register("name")}
              />
            </FormField>

            <FormField label="Email" htmlFor="profile-email">
              <Input
                id="profile-email"
                type="email"
                value={user?.email ?? ""}
                disabled
                readOnly
                className="cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                Email can&apos;t be changed.
              </p>
            </FormField>

            <FormField
              label="Date of birth"
              htmlFor="profile-dob"
              error={errors.dateOfBirth?.message}
            >
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field }) => (
                  <DatePickerField
                    id="profile-dob"
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
              htmlFor="profile-phone"
              error={errors.phone?.message}
            >
              <Input
                id="profile-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0912345678"
                aria-invalid={errors.phone ? true : undefined}
                {...register("phone")}
              />
            </FormField>

            <div className="mt-2 flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                {isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
