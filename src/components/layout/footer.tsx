import Link from "next/link";

// Footer link columns; links only to routes that already exist.
const linkColumns = [
  {
    title: "Books",
    links: [
      { label: "Browse books", href: "/book" },
      { label: "Collections", href: "/collections" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My account", href: "/account" },
      { label: "Wishlist", href: "/wishlist" },
    ],
  },
  {
    title: "Cart",
    links: [{ label: "Shopping cart", href: "/cart" }],
  },
  {
    title: "Login",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Create an account", href: "/register" },
    ],
  },
];

// Site-wide footer: brand blurb, existing-route link columns, and copyright.
export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="max-w-xs sm:col-span-2">
            <p className="font-heading text-lg font-semibold tracking-tight">
              Readora
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              An independent bookshop with a curated shelf of new releases,
              forgotten favorites, and the occasional paperback that becomes a
              permanent resident.
            </p>
          </div>
          {linkColumns.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-medium">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
          © 2026 Readora. Independent bookshop.
        </p>
      </div>
    </footer>
  );
}
