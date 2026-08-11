import { redirect } from "next/navigation";

// /login kept for existing links; /auth?mode=login is the real route (FR-1.3).
export default function LoginPage() {
  redirect("/auth?mode=login");
}
