import { PasswordForm } from "@/components/account/password-form";

// Server shell for /account/password; the client form validates the current
// password and updates the in-memory credential map (FR-4.1..4.5).
export default function PasswordPage() {
  return <PasswordForm />;
}
