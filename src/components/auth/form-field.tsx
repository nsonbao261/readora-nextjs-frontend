import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

// Shared field wrapper: label + control (any Input/Select content) + inline
// error. Keeps the form components small and the error pattern consistent
// across login/register/forgot-password.
export function FormField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
