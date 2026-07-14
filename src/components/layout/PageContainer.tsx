import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

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

/** Full-width portal page shell — consistent vertical rhythm + padding. */
export function PageContainer({
  children,
  className = "",
  size = "default",
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "portal-page flex w-full flex-col",
        maxWidth[size],
        "gap-4 px-4 pb-5 pt-3 sm:gap-5 sm:px-6 sm:pb-6 sm:pt-4 lg:gap-5 lg:px-8 lg:pb-8 lg:pt-5",
        className
      )}
    >
      {children}
    </div>
  );
}
