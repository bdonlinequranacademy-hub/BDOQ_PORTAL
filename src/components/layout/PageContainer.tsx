import type { ReactNode } from "react";

type PageSize = "default" | "narrow" | "wide";

const maxWidth: Record<PageSize, string> = {
  default: "max-w-6xl",
  narrow: "max-w-3xl",
  wide: "max-w-[90rem]",
};

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  size?: PageSize;
}

/** Centers portal page content on tablet/desktop; full width on small phones. */
export function PageContainer({
  children,
  className = "",
  size = "default",
}: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${maxWidth[size]} px-5 py-6 sm:px-6 lg:px-8 lg:py-8 ${className}`}
    >
      {children}
    </div>
  );
}
