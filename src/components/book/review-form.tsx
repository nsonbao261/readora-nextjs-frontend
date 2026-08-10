"use client";

import { useState } from "react";
import { StarIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/auth-store";
import { LoginGateDialog } from "@/components/shared/login-gate-dialog";
import { cn } from "@/lib/utils";

// Interactive star-rating + textarea review form. Guests who tap a star or
// submit hit the login-gate dialog; signed-in submissions fire a toast and the
// form resets into a submitted state so duplicates can't be posted
// (FR-8.3/8.4/8.5).
export function ReviewForm({ bookTitle }: { bookTitle: string }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);

  // Returns true when the user is a guest, opening the login gate first.
  function gateIfGuest(): boolean {
    if (isAuthenticated) {
      return false;
    }
    setGateOpen(true);
    return true;
  }

  // Records the hovered star (0 clears the preview state).
  function handleHover(next: number) {
    setHoverRating(next);
  }

  // Sets the selected rating, or gates guests behind the login dialog.
  function handleRate(next: number) {
    if (gateIfGuest()) {
      return;
    }
    setRating(next);
  }

  // Submits the review: gates guests, validates a rating, then toasts and
  // locks the form into a submitted state (FR-8.4/8.5).
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (gateIfGuest()) {
      return;
    }
    if (rating === 0) {
      toast("Choose a star rating first");
      return;
    }
    setSubmitted(true);
    toast.success("Thanks for your review");
    setRating(0);
    setContent("");
  }

  const preview = hoverRating || rating;

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div
          className="flex items-center gap-1"
          onMouseLeave={() => handleHover(0)}
          role="radiogroup"
          aria-label="Star rating"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const value = i + 1;
            return (
              <button
                key={value}
                type="button"
                disabled={submitted}
                aria-label={`Rate ${value} of 5 stars`}
                className="rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                onMouseEnter={() => handleHover(value)}
                onFocus={() => handleHover(value)}
                onClick={() => handleRate(value)}
              >
                <StarIcon
                  className={cn(
                    "size-6 transition-colors",
                    value <= preview
                      ? "fill-primary text-primary"
                      : "text-muted-foreground/40",
                  )}
                />
              </button>
            );
          })}
        </div>

        <Textarea
          placeholder={`What did you think of ${bookTitle}?`}
          value={content}
          disabled={submitted}
          onChange={(event) => setContent(event.target.value)}
        />

        <div className="flex items-center gap-2">
          <Button type="submit" className="cursor-pointer" disabled={submitted}>
            {submitted ? "Submitted" : "Submit"}
          </Button>
          {submitted && (
            <p className="text-sm text-muted-foreground">Thanks for sharing!</p>
          )}
        </div>
      </form>

      <LoginGateDialog
        open={gateOpen}
        onOpenChange={setGateOpen}
        description="Log in to rate books and share your reviews."
      />
    </>
  );
}
