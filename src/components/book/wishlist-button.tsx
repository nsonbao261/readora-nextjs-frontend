"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartIcon } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Wishlist toggle for a book card. Signed-in users get a local toggle with
// toast feedback; guests are gated behind a "log in to save" dialog.
export function WishlistButton({ bookTitle }: { bookTitle: string }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [wishlisted, setWishlisted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Toggles wishlist state for signed-in users, or opens the login-gate
  // dialog for guests. Fires a toast on every add/remove.
  function handleToggle() {
    if (!isAuthenticated) {
      setDialogOpen(true);
      return;
    }

    setWishlisted((current) => {
      const next = !current;
      if (next) {
        toast.success("Added to your wishlist");
      } else {
        toast("Removed from your wishlist");
      }
      return next;
    });
  }

  return (
    <>
      <Button
        variant={wishlisted ? "secondary" : "ghost"}
        size="icon-sm"
        aria-label={
          wishlisted
            ? `Remove ${bookTitle} from wishlist`
            : `Add ${bookTitle} to wishlist`
        }
        aria-pressed={wishlisted}
        onClick={handleToggle}
      >
        <HeartIcon className={wishlisted ? "fill-current" : undefined} />
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log in to save books</DialogTitle>
            <DialogDescription>
              Create an account to keep {bookTitle} and other favorites in your
              wishlist.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => router.push("/login")}>Log in</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
