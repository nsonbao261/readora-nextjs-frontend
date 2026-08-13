import { AccountOverview } from "@/components/account/account-overview";

// Server shell for /account; the client overview greets the user and shows
// summary cards + recent orders (FR-2.1).
export default function AccountPage() {
  return <AccountOverview />;
}
