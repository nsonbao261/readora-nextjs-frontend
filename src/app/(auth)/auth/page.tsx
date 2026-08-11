import { AuthView, type AuthMode } from "@/components/auth/auth-view";

type AuthSearchParams = Promise<Record<string, string | string[] | undefined>>;

// Server shell for /auth. Reads `mode` (login|register, default login) and an
// optional `redirect` target, then renders the client auth page (FR-1.1/1.4).
export default async function AuthRoutePage({
  searchParams,
}: {
  searchParams: AuthSearchParams;
}) {
  const params = await searchParams;
  const mode: AuthMode = params.mode === "register" ? "register" : "login";
  const redirect =
    typeof params.redirect === "string" ? params.redirect : undefined;
  return <AuthView mode={mode} redirect={redirect} />;
}
