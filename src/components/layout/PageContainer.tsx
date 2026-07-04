import type { ReactNode } from "react";

type PageSize = "default" | "narrow" | "wide";

const maxWidth: Record<PageSize, string> = {
  default: "max-w-none",
  narrow: "max-w-3xl",
  wide: "max-w-none",
};

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  size?: PageSize;
}

/** Full-width portal page shell with responsive horizontal padding. */
export function PageContainer({
  children,
  className = "",
  size = "default",
}: PageContainerProps) {
  return (
    <div
      className={`w-full ${maxWidth[size]} px-3 py-4 sm:px-6 lg:px-8 lg:py-8 ${className}`}
    >
      {children}
    </div>
  );
}
