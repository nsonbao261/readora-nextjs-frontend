"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

// Theme-aware sonner Toaster mounted once in the root layout. Re-reads the
// resolved theme from next-themes so toasts follow light/dark/system.
export function Toaster() {
  const { resolvedTheme } = useTheme();

  return <SonnerToaster theme={resolvedTheme as "light" | "dark"} />;
}
