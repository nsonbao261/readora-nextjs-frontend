import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background font-sans text-foreground">
      <main className="flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-10 px-6 py-24 text-center sm:py-32">
        <p className="text-xs font-medium tracking-[0.25em] text-primary uppercase">
          Readora — Independent bookshop
        </p>
        <h1 className="font-heading max-w-2xl text-5xl leading-tight font-medium tracking-tight text-balance sm:text-6xl">
          Books worth keeping on the shelf.
        </h1>
        <p className="max-w-lg text-lg leading-8 text-muted-foreground">
          A curated shelf of new releases, forgotten favorites, and the
          occasional paperback that becomes a permanent resident.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/catalog"
            className="flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Browse the catalog
          </Link>
          <Link
            href="/collections"
            className="flex h-12 items-center justify-center rounded-lg border border-border px-6 text-sm font-medium transition-colors hover:bg-muted"
          >
            Shop by collection
          </Link>
        </div>
      </main>
    </div>
  );
}
