import { CollectionDetail } from "@/components/account/collection-detail";

// Server shell for /account/collections/[slug]; the client resolves the
// collection from the store and renders its books (FR-5.3, 5.4).
export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CollectionDetail slug={slug} />;
}
