import { cn } from "@/lib/utils/cn";

interface IAdminCmsStatusBadgeProps {
  showOnWebsite: boolean;
}

export function AdminCmsStatusBadge({ showOnWebsite }: IAdminCmsStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        showOnWebsite
          ? "bg-primary/10 text-primary-dark"
          : "bg-portal-muted/50 text-portal-muted"
      )}
    >
      {showOnWebsite ? "Published" : "Draft"}
    </span>
  );
}
