import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";

interface ListDetailLayoutProps {
  list: ReactNode;
}

/** Master-detail: stacked on mobile, side-by-side from lg breakpoint. */
export function ListDetailLayout({ list }: ListDetailLayoutProps) {
  return (
    <div className="flex flex-col gap-0 lg:min-h-[calc(100vh-8rem)] lg:flex-row lg:gap-0">
      <aside className="shrink-0 border-b border-portal bg-portal-surface lg:w-[min(380px,38%)] lg:border-b-0 lg:border-r">
        {list}
      </aside>
      <section className="min-h-[50vh] flex-1 bg-portal lg:min-h-0">
        <Outlet />
      </section>
    </div>
  );
}
