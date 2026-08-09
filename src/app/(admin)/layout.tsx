import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin flex min-h-full flex-1 flex-col bg-background">
      {children}
    </div>
  );
}
