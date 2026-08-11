import { redirect } from "next/navigation";

// /register kept for existing links; /auth?mode=register is the real route
// (FR-1.3).
export default function RegisterPage() {
  redirect("/auth?mode=register");
}
