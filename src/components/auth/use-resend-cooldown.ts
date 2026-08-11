"use client";

import { useEffect, useState } from "react";
import { RESEND_COOLDOWN_SECONDS } from "@/constants/auth";

// Countdown shared by the verification and forgot-password resend buttons.
// Returns the seconds remaining and a `reset()` that restarts the cooldown
// after a resend (FR-3.5, FR-6.3).
export function useResendCooldown() {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((seconds) => (seconds > 0 ? seconds - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return {
    secondsLeft,
    canResend: secondsLeft <= 0,
    reset: () => setSecondsLeft(RESEND_COOLDOWN_SECONDS),
  };
}
