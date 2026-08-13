import type { ReactNode } from "react";

import { AccountShell } from "@/components/account/account-shell";

// Server layout for every /account page: delegates to the client AccountShell
// which renders the section nav and gates guests (FR-1.1, FR-1.3).
export default function AccountLayout({ children }: { children: ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
