import { ProfileForm } from "@/components/account/profile-form";

// Server shell for /account/profile; the client form edits name/phone/dob
// (email read-only) via the auth store (FR-3.1..3.3).
export default function ProfilePage() {
  return <ProfileForm />;
}
