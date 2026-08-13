import { CollectionsList } from "@/components/account/collections-list";

// Server shell for /account/collections; the client list renders the
// collection grid with create/rename/delete actions (FR-5.1, 5.2, 5.5).
export default function CollectionsPage() {
  return <CollectionsList />;
}
