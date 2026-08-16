"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authHrefFromCurrent } from "@/components/auth/auth-utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Reusable auth gate: renders a dialog prompting guests to log in, with a
// CTA that navigates to `/auth?mode=login` (returning to the current page
// after signing in). Used by the review form and the add-to-collection flow
// (WishlistButton keeps its own copy).
export function LoginGateDialog({
  open,
  onOpenChange,
  title = "Log in to continue",
  description,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
}) {
  const router = useRouter();

  // Sends guests to login, carrying the current page as the post-auth
  // redirect so they return where they left off.
  function goToLogin() {
    const { pathname, search } = window.location;
    router.push(authHrefFromCurrent("login", pathname, search));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={goToLogin}>
            Log in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
