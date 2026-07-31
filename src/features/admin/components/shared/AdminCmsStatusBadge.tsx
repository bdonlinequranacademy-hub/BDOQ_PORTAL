import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminCmsStatusBadgeProps {
  showOnWebsite: boolean;
}

export function AdminCmsStatusBadge({ showOnWebsite }: IAdminCmsStatusBadgeProps) {
  const { statusLabel } = usePortalTranslation();

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        showOnWebsite
          ? "bg-primary/10 text-primary-dark"
          : "bg-portal-muted/50 text-portal-muted"
      )}
    >
      {statusLabel(showOnWebsite ? "published" : "draft")}
    </span>
  );
}
