import { OrderDetail } from "@/components/account/order-detail";

// Server shell for /account/orders/[id]; the client detail resolves the order
// and renders items, totals, timeline, and cancellation (FR-9.1..9.4).
export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetail id={id} />;
}
