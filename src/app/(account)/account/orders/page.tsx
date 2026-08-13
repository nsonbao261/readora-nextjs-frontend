import { OrdersList } from "@/components/account/orders-list";

// Server shell for /account/orders; the client list shows seeded orders
// newest-first with status badges (FR-8.1, 8.2).
export default function OrdersPage() {
  return <OrdersList />;
}
